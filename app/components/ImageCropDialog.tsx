"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/provider"
import { toProxiedBangumiImageUrl } from "../utils/imageProxy"
import type { Area } from "react-easy-crop"

interface ImageCropDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string | null
  onConfirm: (croppedImageBase64: string) => void
}

/**
 * 创建裁剪后的图片（压缩优化）
 */
const createCroppedImage = async (
  imageSrc: string,
  croppedAreaPixels: Area,
  maxWidth = 800
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Unable to get canvas context'))
        return
      }

      // 计算目标尺寸，保持3:4比例且不超过最大宽度
      const targetRatio = 3 / 4
      let targetWidth = croppedAreaPixels.width
      let targetHeight = croppedAreaPixels.height
      
      // 如果裁剪区域过大，按比例缩小
      if (targetWidth > maxWidth) {
        targetWidth = maxWidth
        targetHeight = targetWidth / targetRatio
      }

      // 设置canvas为目标尺寸
      canvas.width = targetWidth
      canvas.height = targetHeight

      // 绘制裁剪后的图片
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        targetWidth,
        targetHeight
      )

      // 转换为JPEG格式，质量0.9
      const base64Image = canvas.toDataURL('image/jpeg', 0.9)
      resolve(base64Image)
    }
    image.onerror = () => {
      reject(new Error('Image failed to load'))
    }
  })
}

/**
 * 图片裁剪对话框组件
 */
export function ImageCropDialog({ isOpen, onOpenChange, imageSrc, onConfirm }: ImageCropDialogProps) {
  const { t } = useI18n()
  const displayImageSrc = toProxiedBangumiImageUrl(imageSrc)
  
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleConfirm = async () => {
    if (!displayImageSrc || !croppedAreaPixels) return
    
    setIsProcessing(true)
    try {
      const croppedImage = await createCroppedImage(displayImageSrc, croppedAreaPixels)
      onConfirm(croppedImage)
      onOpenChange(false)
    } catch (error) {
      console.error('裁剪图片失败:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    // 重置状态
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setImageLoaded(false)
    setImageError(false)
    onOpenChange(false)
  }

  const handleMediaLoaded = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleMediaLoadError = () => {
    setImageLoaded(false)
    setImageError(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-h-[90vh] sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('crop.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 裁剪区域 */}
          <div className="relative w-full h-[50vh] sm:h-[400px] bg-gray-100 rounded">
            {imageError && (
              <div className="flex items-center justify-center h-full text-red-500">
                <p>{t('error.image_load_failed_retry')}</p>
              </div>
            )}
            {!imageError && !imageLoaded && displayImageSrc && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>{t('error.loading')}</p>
              </div>
            )}
            {displayImageSrc && !imageError && (
              <Cropper
                image={displayImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                onMediaLoaded={handleMediaLoaded}
                onMediaLoadError={handleMediaLoadError}
              />
            )}
          </div>

          {/* 缩放控制 */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">{t('crop.zoom')}</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <p className="text-xs text-gray-500">{t('crop.tip')}</p>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isProcessing}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isProcessing || !croppedAreaPixels || !imageLoaded || imageError}
          >
            {isProcessing ? t('error.processing') : String(t('common.confirm'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
