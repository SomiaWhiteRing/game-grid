"use client"

import { useState, useEffect } from "react"
import { ToastProvider } from "@/components/ui/toast"
import { GameGrid } from "./components/GameGrid"
import { GameCell } from "./types"
import { CELL_TITLES } from "./constants"
import { loadCellsFromDB } from "./utils/indexedDB"

export default function Home() {
  // 初始化游戏格子数据
  const [cells, setCells] = useState<GameCell[]>(
    CELL_TITLES.map((title, index) => ({
      id: index,
      title,
      image: null,
      name: null,
      imageObj: null,
    }))
  )
  
  const [loading, setLoading] = useState(true)

  // 从IndexedDB加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedCells = await loadCellsFromDB()
        
        if (savedCells && savedCells.length > 0) {
          // 合并保存的数据和初始数据
          setCells(prevCells => {
            const newCells = [...prevCells]
            savedCells.forEach((savedCell) => {
              const index = newCells.findIndex((cell) => cell.id === savedCell.id)
              if (index !== -1) {
                newCells[index] = { ...newCells[index], ...savedCell }
              }
            })
            return newCells
          })
        }
      } catch (error) {
        console.error("加载数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // 更新单元格数据的处理函数
  const handleUpdateCells = (newCells: GameCell[]) => {
    setCells(newCells)
  }

  return (
    <ToastProvider>
      <main className="min-h-screen flex flex-col items-center py-8 px-4 relative">
        {!loading && (
          <GameGrid 
            initialCells={cells} 
            onUpdateCells={handleUpdateCells} 
          />
        )}
        
        <div className="fixed bottom-4 right-4 text-sm text-gray-500 text-right">
          <p>Made with ❤️ by @nth97</p>
          <p>Powered by SteamGridDB</p>
        </div>
      </main>
    </ToastProvider>
  )
}

