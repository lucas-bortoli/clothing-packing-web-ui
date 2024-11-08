import { render } from "preact";
import { useState } from "preact/hooks";
import * as apiClient from "./ApiClient";
import { ShirtSize } from "./ApiClient";
import Button, { IconButton } from "./Components/Button";
import Icon from "./Components/Icon";
import "./index.css";
import { useTable } from "./Table";
import Color from "./Utils/Color";
import Run from "./Utils/Run";

//@ts-expect-error
window.apiClient = apiClient;

const ShirtSizes = [
  { iconName: "SizeP", size: "P" satisfies ShirtSize },
  { iconName: "SizeM", size: "M" satisfies ShirtSize },
  { iconName: "SizeG", size: "G" satisfies ShirtSize },
  // { iconName: "SizeGG", size: "GG" satisfies ShirtSize },
] as const;

enum Algorithm {
  MaxRects,
  Skyline,
  Guillotine,
}

function App() {
  const [visibleAlgos, setVisibleAlgos] = useState<Set<Algorithm>>(
    new Set([Algorithm.Guillotine, Algorithm.MaxRects, Algorithm.Skyline]),
  );

  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isMutationPending, setIsMutationPending] = useState(false);

  const table = useTable(currentOrderId, 100, 100);

  async function createNewTable() {
    setIsMutationPending(true);
    const orderId = await apiClient.table.create(100, 100);
    setCurrentOrderId(orderId);
    setIsMutationPending(false);
  }

  async function commitTable() {
    setIsMutationPending(true);
    setCurrentOrderId(null);
    setIsMutationPending(false);
  }

  const areControlsDisabled = currentOrderId === null || isMutationPending;

  return (
    <div class="mx-auto flex h-full w-full max-w-screen-md select-none flex-col gap-2 p-2">
      <h1 class="text-2xl">Cloth Packing Web UI</h1>
      <hr />
      <div class="flex justify-between gap-1">
        <Button disabled={currentOrderId !== null} onClick={createNewTable}>
          <Icon name="NewLayer" />
          Iniciar nova mesa
        </Button>
        <Button disabled={areControlsDisabled} onClick={commitTable}>
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
                  onClick={table.addToQueue.bind(null, size.size)}
                />
              );
            })}
          </section>
        </div>
        <div class="flex h-full flex-1 grow flex-col gap-1">
          <label class="text-sm">Processo atual</label>
          <section class="border border-grey-800 shadow-pixel">
            <div class="group flex items-center gap-2 px-4 py-1 hover:bg-grey-200">
              {Run(() => {
                if (table.currentProcessingItem === null) {
                  return (
                    <span class="grow italic text-grey-700">Nenhum item sendo processado</span>
                  );
                } else {
                  return <span class="grow">Tamanho {table.currentProcessingItem}</span>;
                }
              })}
            </div>
          </section>
          <label class="text-sm">Fila de processamento</label>
          <section class="grow overflow-y-scroll border border-grey-800 shadow-pixel">
            {table.processingQueue.map((size, i) => {
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
                      onClick={table.queueMoveItem.bind(null, i, "up")}
                    />
                    <IconButton
                      iconName="ArrowDown"
                      buttonSize="small"
                      disabled={areControlsDisabled}
                      onClick={table.queueMoveItem.bind(null, i, "down")}
                    />
                    <IconButton
                      iconName="Delete"
                      buttonSize="small"
                      class="ml-1"
                      disabled={areControlsDisabled}
                      onClick={table.queueDeleteItem.bind(null, i)}
                    />
                  </div>
                </div>
              );
            })}
          </section>
        </div>
        <div class="flex h-full flex-1 grow flex-col gap-1">
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
            rects: table.rectsMaxRects,
            algoName: "Max Rects",
            friendlyColor: [255, 0, 0],
          },
          {
            algo: Algorithm.Skyline,
            rects: table.rectsSkyline,
            algoName: "Skyline",
            friendlyColor: [0, 255, 0],
          },
          {
            algo: Algorithm.Guillotine,
            rects: table.rectsGuillotine,
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
              <IconButton
                iconName="Refresh"
                disabled={areControlsDisabled}
                onClick={function rotate() {
                  setVisibleAlgos((v) => {
                    const t = new Set<Algorithm>();
                    if (v.has(Algorithm.MaxRects)) {
                      t.add(Algorithm.Skyline);
                    } else if (v.has(Algorithm.Skyline)) {
                      t.add(Algorithm.Guillotine);
                    } else if (v.has(Algorithm.Guillotine)) {
                      t.add(Algorithm.MaxRects);
                    }
                    return t;
                  });
                }}
              />
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
                  <Button key={algo.algoName} onClick={toggle} disabled={areControlsDisabled}>
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
