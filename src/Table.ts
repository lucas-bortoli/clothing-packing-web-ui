import { useEffect, useState } from "preact/hooks";
import * as apiClient from "./ApiClient";
import Run from "./Utils/Run";

export default class Table {
  public readonly width: number;
  public readonly height: number;

  public orderId: string | null;

  public readonly rects: {
    maxRects: apiClient.Rect[];
    guillotine: apiClient.Rect[];
    skyline: apiClient.Rect[];
  };

  constructor(width: number, height: number) {
    this.orderId = null;
    this.width = width;
    this.height = height;
    this.rects = { maxRects: [], guillotine: [], skyline: [] };
  }

  async init() {
    const orderId = await apiClient.table.create(this.width, this.height);
    this.orderId = orderId;
    await this.fetchLatestData();
  }

  private async fetchLatestData() {
    if (!this.orderId) {
      throw new Error("É preciso chamar init() antes de fetchLatestData().");
    }

    const { maxRects, guillotine, skyline } = await apiClient.table.getState(this.orderId);
    this.rects.maxRects = maxRects;
    this.rects.guillotine = guillotine;
    this.rects.skyline = skyline;
  }
}

export function useTable(orderId: string | null, tableWidth: number, tableHeight: number) {
  const [tableDimensions, setTableDimensions] = useState<{ width: number; height: number }>({
    width: tableWidth,
    height: tableHeight,
  });
  const [rectsMaxRects, setRectsMaxRects] = useState<apiClient.Rect[]>([]);
  const [rectsSkyline, setRectsSkyline] = useState<apiClient.Rect[]>([]);
  const [rectsGuillotine, setRectsGuillotine] = useState<apiClient.Rect[]>([]);

  const [processingQueue, setProcessingQueue] = useState<apiClient.ShirtSize[]>([]);
  const [currentProcessingItem, setCurrentProcessingItem] = useState<apiClient.ShirtSize | null>(
    null,
  );

  useEffect(() => {
    if (orderId === null) return;

    Run(async () => {
      const tableState = await apiClient.table.getState(orderId);
      setRectsGuillotine(tableState.guillotine);
      setRectsMaxRects(tableState.maxRects);
      setRectsSkyline(tableState.skyline);
      setTableDimensions({ width: tableState.width, height: tableState.height });
    });
  }, [orderId, processingQueue]);

  useEffect(() => {
    if (orderId === null || processingQueue.length === 0 || currentProcessingItem !== null) return;

    Run(async () => {
      const nextClothingItem = processingQueue[0]!;

      // avançar item na fila
      setProcessingQueue((oldQueue) => oldQueue.slice(1));
      setCurrentProcessingItem(nextClothingItem);
      await apiClient.table.addShirt(orderId, nextClothingItem);

      // atualizar dados da tela
      const tableState = await apiClient.table.getState(orderId);
      setRectsGuillotine(tableState.guillotine);
      setRectsMaxRects(tableState.maxRects);
      setRectsSkyline(tableState.skyline);
      setTableDimensions({ width: tableState.width, height: tableState.height });

      setCurrentProcessingItem(null);
    });
  }, [orderId, processingQueue, currentProcessingItem]);

  return {
    tableDimensions,
    currentProcessingItem,
    processingQueue,
    rectsGuillotine,
    rectsMaxRects,
    rectsSkyline,
    addToQueue: (clothingItem: apiClient.ShirtSize) => {
      setProcessingQueue((queue) => [...queue, clothingItem]);
    },
    queueMoveItem: (itemIndex: number, direction: "up" | "down") => {
      setProcessingQueue((queue) => {
        if (direction === "up") {
          if (itemIndex === 0) return queue;
          const newArr = queue.slice();
          const a = newArr[itemIndex];
          const b = newArr[itemIndex - 1];
          newArr[itemIndex] = b;
          newArr[itemIndex - 1] = a;
          return newArr;
        } else {
          if (itemIndex === queue.length - 1) return queue;
          const newArr = queue.slice();
          const a = newArr[itemIndex];
          const b = newArr[itemIndex + 1];
          newArr[itemIndex] = b;
          newArr[itemIndex + 1] = a;
          return newArr;
        }
      });
    },
    queueDeleteItem: (itemIndex: number) => {
      setProcessingQueue((queue) => {
        return queue.filter((_, i) => itemIndex !== i);
      });
    },
  };
}
