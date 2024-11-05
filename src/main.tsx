import { render } from "preact";
import { useState } from "preact/hooks";
import { Rect, ShirtSize } from "./ApiClient";
import Button, { IconButton } from "./Components/Button";
import Icon from "./Components/Icon";
import "./index.css";
import Color from "./Utils/Color";
import Run from "./Utils/Run";
import * as apiClient from "./ApiClient";

const ShirtSizes = [
  { iconName: "SizeP", size: "P" satisfies ShirtSize },
  { iconName: "SizeM", size: "M" satisfies ShirtSize },
  { iconName: "SizeG", size: "G" satisfies ShirtSize },
  { iconName: "SizeGG", size: "GG" satisfies ShirtSize },
] as const;

enum Algorithm {
  MaxRects,
  Skyline,
  Guillotine,
}

function App() {
  const [processQueue, setProcessQueue] = useState<ShirtSize[]>(["G", "M", "GG", "P"]);

  const [rectsMaxRects, setRectsMaxRects] = useState<Rect[]>([
    { clothingId: "a", x: 10, y: 10, width: 50, height: 10 },
    { clothingId: "a", x: 10, y: 20, width: 50, height: 20 },
    { clothingId: "a", x: 10, y: 40, width: 50, height: 50 },
    { clothingId: "a", x: 60, y: 40, width: 50, height: 50 },
  ]);

  const [rectsSkyline, setRectsSkyline] = useState<Rect[]>([
    { clothingId: "a", x: 23, y: 75, width: 50, height: 35 },
    { clothingId: "a", x: 91, y: 18, width: 50, height: 40 },
    { clothingId: "a", x: 42, y: 59, width: 50, height: 48 },
    { clothingId: "a", x: 13, y: 31, width: 50, height: 22 },
  ]);

  const [rectsGuillotine, setRectsGuillotine] = useState<Rect[]>([
    { clothingId: "a", x: 67, y: 29, width: 50, height: 19 },
    { clothingId: "a", x: 85, y: 51, width: 50, height: 41 },
    { clothingId: "a", x: 31, y: 93, width: 50, height: 13 },
    { clothingId: "a", x: 49, y: 17, width: 50, height: 62 },
  ]);

  const [visibleAlgos, setVisibleAlgos] = useState<Set<Algorithm>>(
    new Set([Algorithm.Guillotine, Algorithm.MaxRects, Algorithm.Skyline]),
  );

  const [currentOrder, setCurrentOrder] = useState<string | null>(null);
  const [isMutationPending, setIsMutationPending] = useState(false);
  async function refreshTableStatus() {
    const state = await apiClient.table.getState(currentOrder!);
    setRectsGuillotine(state.guillotine);
    setRectsMaxRects(state.maxRects);
    setRectsSkyline(state.skyline);
  }

  const areControlsDisabled = currentOrder === null || isMutationPending;

  return (
    <div class="mx-auto flex h-full w-full max-w-screen-md select-none flex-col gap-2 p-2">
      <h1 class="text-2xl">Cloth Packing Web UI</h1>
      <hr />
      <div class="flex justify-between gap-1">
        <Button disabled={currentOrder !== null} onClick={() => setCurrentOrder("TODO")}>
          <Icon name="NewLayer" />
          Iniciar nova mesa
        </Button>
        <Button disabled={areControlsDisabled} onClick={() => setCurrentOrder(null)}>
          <Icon name="Build" />
          Confirmar mesa atual
        </Button>
      </div>
      <div class="flex h-48 gap-2">
        <div class="flex h-full w-16 flex-col gap-1">
          <label class="text-sm">Paleta</label>
          <section class="inline-grid grid-cols-2 grid-rows-2">
            {ShirtSizes.map((size, i) => {
              return (
                <IconButton
                  key={i}
                  iconName={size.iconName}
                  disabled={areControlsDisabled}
                  class="w-full"
                  onClick={function addIt() {
                    setProcessQueue([...processQueue, size.size]);
                  }}
                />
              );
            })}
          </section>
        </div>
        <div class="flex h-full grow flex-col gap-1">
          <label class="text-sm">Fila de processamento</label>
          <section class="grow overflow-y-scroll border border-grey-800 shadow-pixel">
            {processQueue.map((size, i) => {
              return (
                <div key={i} class="group flex items-center gap-2 px-4 py-1 hover:bg-grey-200">
                  <span class="grow">
                    {i + 1}. Tamanho {size}
                  </span>
                  <div class="invisible group-hover:visible">
                    <IconButton
                      iconName="ArrowUp"
                      buttonSize="small"
                      disabled={areControlsDisabled}
                      onClick={function moveUp() {
                        if (i === 0) return;
                        const newArr = processQueue.slice();
                        const a = newArr[i];
                        const b = newArr[i - 1];
                        newArr[i] = b;
                        newArr[i - 1] = a;
                        setProcessQueue(newArr);
                      }}
                    />
                    <IconButton
                      iconName="ArrowDown"
                      buttonSize="small"
                      disabled={areControlsDisabled}
                      onClick={function moveDown() {
                        if (i === processQueue.length - 1) return;
                        const newArr = processQueue.slice();
                        const a = newArr[i];
                        const b = newArr[i + 1];
                        newArr[i] = b;
                        newArr[i + 1] = a;
                        setProcessQueue(newArr);
                      }}
                    />
                    <IconButton
                      iconName="Delete"
                      buttonSize="small"
                      class="ml-1"
                      disabled={areControlsDisabled}
                      onClick={function deleteIt() {
                        setProcessQueue((qs) => qs.filter((_, j) => j !== i));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </section>
          <label class="text-sm">Processo atual</label>
          <section class="border border-grey-800 shadow-pixel">
            <div class="group flex items-center gap-2 px-4 py-1 hover:bg-grey-200">
              <span class="grow">Tamanho GG (10%)</span>
            </div>
          </section>
        </div>
        <div class="flex h-full grow flex-col gap-1">
          <label class="text-sm">Peças na mesa</label>
          <section class="grow overflow-y-scroll border border-grey-800 shadow-pixel">
            {(["M", "G", "P", "GG", "M", "P", "M", "M", "G"] as const).map((size, i) => {
              return (
                <div key={i} class="group flex items-center gap-2 px-4 py-1 hover:bg-grey-200">
                  <span class="grow">
                    {i + 1}. Tamanho {size}
                  </span>
                  <div class="invisible group-hover:visible">
                    <IconButton iconName="Delete" buttonSize="small" class="ml-1" />
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>
      {Run(() => {
        const algos = [
          {
            algo: Algorithm.MaxRects,
            rects: rectsMaxRects,
            algoName: "Max Rects",
            friendlyColor: [255, 0, 0],
          },
          {
            algo: Algorithm.Skyline,
            rects: rectsSkyline,
            algoName: "Skyline",
            friendlyColor: [0, 255, 0],
          },
          {
            algo: Algorithm.Guillotine,
            rects: rectsGuillotine,
            algoName: "Guillotine",
            friendlyColor: [0, 0, 255],
          },
        ] as const;

        return (
          <div class="flex flex-col gap-1">
            <label class="text-sm">Mesa de corte</label>
            <div class="relative box-content aspect-[3/2] w-full border border-grey-800">
              {algos.map((algo) => {
                if (!visibleAlgos.has(algo.algo)) return;

                return (
                  <main
                    key={algo.algoName}
                    class="absolute left-0 top-0 h-full w-full overflow-clip"
                    style={{ opacity: 1 / visibleAlgos.size }}
                  >
                    {algo.rects.map((rect, i) => (
                      <div
                        key={i}
                        class="absolute border-2 border-rustic-red-400"
                        style={{
                          width: rect.width,
                          height: rect.height,
                          top: rect.y,
                          left: rect.x,
                          backgroundColor: Color.fromRgb(
                            algo.friendlyColor[0],
                            algo.friendlyColor[1],
                            algo.friendlyColor[2],
                          ).toCss("hsl"),
                          borderColor: Color.fromRgb(
                            algo.friendlyColor[0],
                            algo.friendlyColor[1],
                            algo.friendlyColor[2],
                          )
                            .adjustBrightness(0.5)
                            .toCss("hsl"),
                        }}
                      />
                    ))}
                  </main>
                );
              })}
            </div>
            <footer class="flex gap-1">
              {algos.map((algo) => {
                function toggle() {
                  setVisibleAlgos((v) => {
                    if (v.has(algo.algo) && v.size > 1) {
                      v.delete(algo.algo);
                    } else {
                      v.add(algo.algo);
                    }
                    return new Set(v);
                  });
                }
                return (
                  <Button
                    key={algo.algoName}
                    onClick={toggle}
                    disabled={areControlsDisabled}
                    style={{
                      fontWeight: visibleAlgos.has(algo.algo) ? "bold" : "normal",
                    }}
                  >
                    {visibleAlgos.has(algo.algo) && <Icon name="Check" />}
                    <span
                      class="inline-block h-4 w-4"
                      style={{
                        backgroundColor: Color.fromRgb(
                          algo.friendlyColor[0],
                          algo.friendlyColor[1],
                          algo.friendlyColor[2],
                        ).toCss("hsl"),
                      }}
                    />
                    {algo.algoName}
                  </Button>
                );
              })}
            </footer>
          </div>
        );
      })}
    </div>
  );
}

render(<App />, document.getElementById("app")!);
