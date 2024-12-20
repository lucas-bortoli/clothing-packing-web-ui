const BASE_URL = `${location.protocol}//${location.hostname}:8000`;

export type ShirtSize = "P" | "M" | "G" | "GG";

export interface Rect {
  /** Identificador de qual peça este retângulo pertence */
  clothingId: string;

  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TableState {
  /** ID do pedido/mesa */
  orderId: string;

  width: number;
  height: number;

  /** Lista de todos os retângulos dispostos na mesa pelo algoritmo Max Rects */
  maxRects: Rect[];

  /** Lista de todos os retângulos dispostos na mesa pelo algoritmo Skyline */
  skyline: Rect[];

  /** Lista de todos os retângulos dispostos na mesa pelo algoritmo Guillotine */
  guillotine: Rect[];
}

export const table = {
  /**
   * Cria um pedido novo, retornando seu id.
   */
  create: async (tableWidth: number, tableHeight: number): Promise<string> => {
    const response = await fetch(`${BASE_URL}/table/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        width: tableWidth,
        height: tableHeight,
      }),
    });
    const responseBody = JSON.parse(await response.json());

    return responseBody.id.toString();
  },

  /**
   * Adiciona uma roupa inteira e todos os seus retângulos na mesa.
   * @param size Tamanho da roupa.
   */
  addShirt: async (orderId: string, size: ShirtSize): Promise<void> => {
    const response = await fetch(`${BASE_URL}/table/${orderId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        size: size,
        type: size, // ??????
      }),
    });
    const responseBody = JSON.parse(await response.json());

    return responseBody.id;
  },

  /**
   * Retorna o estado atual da mesa.
   * @param orderId O identificador do pedido ao qual a mesa de corte pertence.
   */
  getState: async (orderId: string): Promise<TableState> => {
    const x = JSON.parse(await fetch(`${BASE_URL}/table/${orderId}`).then((r) => r.json()));
    function screw(fucked: string): TableState["guillotine"] {
      return JSON.parse(fucked.replace(/\(/g, "[").replace(/\)/g, "]").replace(/'/g, '"')).map(
        (v: any[]) => ({
          clothingId: v[0].toString(),
          x: v[1],
          y: v[2],
          width: v[3],
          height: v[4],
        }),
      );
    }
    x.maxRects = x.maxRects === null ? [] : screw(x.maxRects);
    x.guillotine = x.guillotine === null ? [] : screw(x.guillotine);
    x.skyline = x.skyline === null ? [] : screw(x.skyline);

    return x;
  },
};
