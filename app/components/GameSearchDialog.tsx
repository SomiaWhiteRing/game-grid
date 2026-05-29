"use client"

import { useState, useEffect, useRef } from "react"
import NextImage from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Gamepad2, Loader2, AlertCircle, Search, RefreshCw, Info, Upload } from "lucide-react"
import { GameSearchResult } from "../types"
import { useI18n } from "@/lib/i18n/provider"
import { toProxiedBangumiImageUrl } from "../utils/imageProxy"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface GameSearchDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSelectGame: (game: GameSearchResult) => void
  onUploadImage?: (file: File) => void
}

/**
 * 搜索源类型
 */
type SearchSource = 'steamgriddb' | 'bangumi';

/**
 * 搜索状态类型
 */
type SearchStatus = {
  state: 'idle' | 'searching' | 'success' | 'error' | 'no-results';
  message: string;
};

/**
 * 游戏搜索对话框组件
 */
export function GameSearchDialog({ isOpen, onOpenChange, onSelectGame, onUploadImage }: GameSearchDialogProps) {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<GameSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchStatus, setSearchStatus] = useState<SearchStatus>({ 
    state: 'idle', 
    message: String(t('search.idle_hint')) 
  })
  // 添加状态来跟踪总结果数量
  const [totalResults, setTotalResults] = useState<number>(0)
  // 添加搜索源状态
  const [searchSource, setSearchSource] = useState<SearchSource>('bangumi')
  
  // 用于存储搜索请求的 AbortController，以便能取消进行中的请求
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // 上一次搜索的关键词
  const lastSearchTermRef = useRef<string>("");

  // 当对话框打开或关闭时重置状态
  useEffect(() => {
    if (isOpen) {
      // 仅在打开时重置状态，不重置搜索词和结果，以便用户可以继续之前的搜索
      setIsLoading(false);
      setSearchStatus({ state: searchResults.length > 0 ? 'success' : 'idle', message: searchResults.length > 0 ? '' : String(t('search.idle_hint')) });
    } else {
      // 关闭时取消正在进行的搜索请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    }
  }, [isOpen, searchResults.length]);

  // 清空搜索结果和状态
  const handleClearSearch = () => {
    // 取消正在进行的搜索请求
    if (abortControllerRef.current) {
      console.log('清除搜索时取消进行中的搜索请求');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // 重置加载状态
    setIsLoading(false);
    
    // 清空搜索内容和结果
    setSearchTerm('');
    setSearchResults([]);
    setTotalResults(0);
    setSearchStatus({ state: 'idle', message: "输入游戏名称开始搜索" });
    lastSearchTermRef.current = '';
  };

  // 处理搜索源切换
  const handleSearchSourceChange = (value: string) => {
    setSearchSource(value as SearchSource);
    // 切换搜索源时清空搜索结果
    handleClearSearch();
  };

  // 搜索游戏 - 使用流式响应
  const searchGames = async (retry: boolean = false) => {
    // 获取搜索词，如果是重试则使用最后一次的搜索词
    const term = retry ? lastSearchTermRef.current : searchTerm.trim();
    
    // 检查搜索词是否为空
    if (!term) {
      setSearchStatus({ state: 'idle', message: String(t('search.idle_hint')) });
      return;
    }
    
    // 取消之前的搜索请求（如果有）
    if (abortControllerRef.current) {
      console.log('取消之前的搜索请求');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();
    const currentAbortController = abortControllerRef.current;
    
    // 更新状态为搜索中
    setIsLoading(true);
    
    // 清除之前的搜索结果，但仅当不是重试的情况下
    if (!retry) {
      setSearchResults([]);
      setTotalResults(0);
    }
    
    setSearchStatus({ state: 'searching', message: '正在搜索...' });
    
    // 保存当前搜索词以便重试
    lastSearchTermRef.current = term;
    
    // 超时定时器
    const timeoutId = setTimeout(() => {
      if (isLoading && currentAbortController === abortControllerRef.current) {
        setSearchStatus({ 
          state: 'searching', 
          message: '搜索时间较长，正在努力获取结果...' 
        });
      }
    }, 3000);

    try {
      // 根据搜索源选择不同的API端点
      const apiEndpoint = searchSource === 'steamgriddb' 
        ? `/api/search?q=${encodeURIComponent(term)}`
        : `/api/bangumi-search?q=${encodeURIComponent(term)}`;
      
      // 使用当前 AbortController 的信号
      const response = await fetch(apiEndpoint, {
        signal: currentAbortController.signal
      });

      // 检查当前操作是否已被更新的请求取代
      if (currentAbortController !== abortControllerRef.current) {
        console.log('搜索请求已被新请求取代');
        return;
      }

      if (!response.ok) {
        throw new Error(`搜索请求失败: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("响应没有正文");
      }

      // 创建一个读取器来处理流数据
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // 临时保存结果的数组
      let games: GameSearchResult[] = [];
      const receivedGames = new Map<string | number, GameSearchResult>();

      let done = false;
      let buffer = "";
      let reachEnd = false;

      // 流式处理部分不变，但添加检查确保当前控制器仍然有效
      while (!done) {
        // 添加检查确保当前控制器仍然有效
        if (currentAbortController !== abortControllerRef.current) {
          console.log('流处理被新请求中断');
          return;
        }
        
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          buffer += decoder.decode(value, { stream: true });

          // 处理缓冲区中的完整消息
          const lines = buffer.split('\n');
          buffer = lines.pop() || ""; // 保留最后一个可能不完整的行

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const data = JSON.parse(line);

              switch (data.type) {
                case "init":
                  // 保存服务端返回的总结果数量
                  if (data.total !== undefined) {
                    setTotalResults(data.total);
                    setSearchStatus({ 
                      state: 'searching', 
                      message: `找到 ${data.total} 个结果，正在加载封面……` 
                    });
                  } else {
                    setSearchStatus({ 
                      state: 'searching', 
                      message: `正在搜索……` 
                    });
                  }
                  break;

                case "gameStart":
                  // 游戏开始加载，添加到结果中（无图片）
                  if (data.game.id !== undefined) {
                    receivedGames.set(data.game.id, data.game);
                  }
                  games = Array.from(receivedGames.values());
                  setSearchResults([...games]);
                  break;

                case "gameComplete":
                  // 游戏加载完成（有图片），更新结果
                  if (data.game.id !== undefined) {
                    receivedGames.set(data.game.id, data.game);
                  }
                  games = Array.from(receivedGames.values());
                  setSearchResults([...games]);
                  break;

                case "gameError":
                  console.error(`游戏 ${data.gameId} 加载失败:`, data.error);
                  break;

                case "error":
                  setSearchStatus({ state: 'error', message: data.message || "搜索失败" });
                  break;

                case "end":
                  reachEnd = true;
                  if (games.length > 0) {
                    setSearchStatus({ state: 'success', message: '' });
                  } else {
                    setSearchStatus({ 
                      state: 'no-results', 
                      message: data.message || "未找到相关游戏" 
                    });
                  }
                  break;
              }
            } catch (error) {
              console.error("解析响应数据失败:", error, line);
            }
          }
        }
      }

      // 如果流结束但没有收到end消息
      if (!reachEnd) {
        if (games.length > 0) {
          setSearchStatus({ state: 'success', message: '' });
        } else {
          setSearchStatus({ state: 'no-results', message: "未找到相关游戏" });
        }
      }

    } catch (error) {
      // 检查是否是当前有效的搜索请求
      if (currentAbortController !== abortControllerRef.current) {
        console.log('搜索错误处理被跳过，因为已有新请求');
        return;
      }
      
      // 如果是用户取消的请求，不显示错误
      if ((error as Error).name === 'AbortError') {
        console.log('搜索请求被取消');
        return;
      }

      console.error("搜索游戏失败:", error);
      
      setSearchStatus({ 
        state: 'error', 
        message: "搜索失败，请检查网络连接后重试" 
      });
    } finally {
      // 只有在当前控制器仍然有效的情况下才清理状态
      if (currentAbortController === abortControllerRef.current) {
        clearTimeout(timeoutId);
        setIsLoading(false);
        
        // 清除 AbortController 引用
        abortControllerRef.current = null;
      }
    }
  }

  // 处理回车键搜索
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      searchGames();
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  }

  // 渲染搜索状态UI
  const renderSearchStatus = () => {
    switch (searchStatus.state) {
      case 'idle':
        return (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <Search className="h-12 w-12 mb-2 opacity-30" />
            <p>{searchStatus.message || String(t('search.idle_hint'))}</p>
          </div>
        );
      case 'searching':
        return (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <Loader2 className="h-8 w-8 mb-2 animate-spin" />
            <p>{searchStatus.message}</p>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-10 text-red-500">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>{searchStatus.message}</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => searchGames(true)}
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('search.retry')}
            </Button>
          </div>
        );
      case 'no-results':
        return (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <Gamepad2 className="h-8 w-8 mb-2 opacity-50" />
            <p>{searchStatus.message}</p>
            <p className="text-sm mt-2">{t('search.try_keywords')}</p>
          </div>
        );
      case 'success':
        return null;
      default:
        return null;
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      // 取消任何进行中的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // 添加文件上传处理函数
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUploadImage) {
      onUploadImage(file);
      onOpenChange(false); // 上传后关闭弹窗
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-h-[90vh] overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('search.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="text-sm text-gray-500 mr-2">{t('search.source')}</span>
            <Tabs defaultValue="steamgriddb" value={searchSource} onValueChange={handleSearchSourceChange} className="flex-1">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bangumi" className="flex items-center justify-center gap-1">
                  Bangumi
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span 
                          className="inline-flex items-center justify-center cursor-help"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={5} align="center">
                        <p>{t('search.bangumi_tip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsTrigger>
                <TabsTrigger value="steamgriddb" className="flex items-center justify-center gap-1">
                  SteamGridDB
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span 
                          className="inline-flex items-center justify-center cursor-help"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={5} align="center">
                        <p>{t('search.sgdb_tip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={String(t('search.placeholder'))}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="pr-8"
              />
              {searchTerm && (
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={handleClearSearch}
                  aria-label={String(t('search.clear'))}
                >
                  ✕
                </button>
              )}
            </div>
            <Button onClick={() => searchGames()} disabled={isLoading || !searchTerm.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('search.searching')}
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  {t('search.search')}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="max-h-[40vh] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px] overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {searchResults.map((game) => {
                const imageSrc = toProxiedBangumiImageUrl(game.image);

                return (
                  <div
                    key={game.id || game.name}
                    onClick={() => onSelectGame(game)}
                    className="cursor-pointer border rounded p-1 sm:p-2 hover:bg-gray-50 transition-colors"
                    title={`${game.name}`}
                  >
                    <div className="relative w-full h-0 pb-[133.33%] rounded overflow-hidden bg-gray-100">
                      {imageSrc ? (
                        <NextImage
                          src={imageSrc}
                          alt={game.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 40vw, 20vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Gamepad2 className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm truncate mt-1 sm:mt-2">{game.name}</p>
                  </div>
                );
              })}
            </div>
          ) : renderSearchStatus()}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row justify-between sm:justify-between border-t pt-2 mt-2">
          <div className="text-xs text-gray-500 mb-2 sm:mb-0">
            {totalResults > 0 && String(t('search.results_count', { count: totalResults }))}
          </div>
          <div className="flex gap-2 w-full sm:w-auto sm:justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="hidden sm:inline-flex"
            >
              {t('common.close')}
            </Button>
            {onUploadImage && (
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center justify-center w-full sm:w-8 h-8 rounded bg-blue-500 hover:bg-blue-600 text-white cursor-pointer transition-colors gap-2"
                  title={String(t('search.upload_image'))}
                >
                  <Upload className="h-4 w-4" />
                  <span className="sm:hidden">{t('search.upload_image')}</span>
                </label>
              </div>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
