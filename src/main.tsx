import { render } from "preact";
import "./index.css";
import Button, { IconButton } from "./Components/Button";
import Checkbox from "./Components/Checkbox";
import Icon from "./Components/Icon";
import { useState } from "preact/hooks";
import doSwitch from "./Utils/SwitchExpression";

enum ShirtSize {
  P,
  M,
  G,
  GG,
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function App() {
  const [processQueue, setProcessQueue] = useState<ShirtSize[]>([
    ShirtSize.G,
    ShirtSize.M,
    ShirtSize.GG,
    ShirtSize.P,
  ]);

  const [rects, setRects] = useState<Rect[]>([
    { x: 10, y: 10, width: 50, height: 10 },
    { x: 10, y: 20, width: 50, height: 20 },
    { x: 10, y: 40, width: 50, height: 50 },
    { x: 60, y: 40, width: 50, height: 50 },
  ]);

  return (
    <div class="w-full h-full max-w-screen-md mx-auto flex flex-col gap-2 p-2 select-none">
      <h1 class="text-2xl">Cloth Packing Web UI</h1>
      <hr />
      <div class="justify-between flex gap-1">
        <Button>
          <Icon name="NewLayer" />
          Iniciar nova mesa
        </Button>
        <Button>
          <Icon name="Build" />
          Confirmar mesa atual
        </Button>
      </div>
      <div class="flex gap-2 h-48">
        <div class="flex flex-col gap-1 h-full w-16">
          <label class="text-sm">Paleta</label>
          <section class="border border-grey-800 shadow-pixel grow overflow-y-scroll p-1">
            {(["SizeP", "SizeM", "SizeG", "SizeGG"] as const).map((size, i) => {
              return (
                <div
                  key={i}
                  class="w-full h-8 mb-1 bg-grey-200 active:bg-grey-400 hover:bg-grey-200 cursor-grab border-grey-200 hover:border-grey-800 border inline-flex justify-center items-center"
                >
                  <Icon name={size} />
                </div>
              );
            })}
          </section>
        </div>
        <div class="flex flex-col gap-1 h-full grow">
          <label class="text-sm">Fila de processamento</label>
          <section class="border border-grey-800 shadow-pixel grow overflow-y-scroll">
            {processQueue.map((size, i) => {
              return (
                <div
                  key={i}
                  class="px-4 py-1 hover:bg-grey-200 flex gap-2 items-center group"
                >
                  <span class="grow">
                    {i + 1}. Tamanho {size}
                  </span>
                  <div class="invisible group-hover:visible">
                    <IconButton iconName="ArrowUp" buttonSize="small" />
                    <IconButton iconName="ArrowDown" buttonSize="small" />
                    <IconButton
                      iconName="Delete"
                      buttonSize="small"
                      class="ml-1"
                    />
                  </div>
                </div>
              );
            })}
          </section>
          <label class="text-sm">Processo atual</label>
          <section class="border border-grey-800 shadow-pixel ">
            <div class="px-4 py-1 hover:bg-grey-200 flex gap-2 items-center group">
              <span class="grow">Tamanho GG (10%)</span>
            </div>
          </section>
        </div>
        <div class="flex flex-col gap-1 h-full grow">
          <label class="text-sm">Peças na mesa</label>
          <section class="border border-grey-800 shadow-pixel grow overflow-y-scroll">
            {(["M", "G", "P", "GG", "M", "P", "M", "M", "G"] as const).map(
              (size, i) => {
                return (
                  <div
                    key={i}
                    class="px-4 py-1 hover:bg-grey-200 flex gap-2 items-center group"
                  >
                    <span class="grow">
                      {i + 1}. Tamanho {size}
                    </span>
                    <div class="invisible group-hover:visible">
                      <IconButton
                        iconName="Delete"
                        buttonSize="small"
                        class="ml-1"
                      />
                    </div>
                  </div>
                );
              }
            )}
          </section>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm">Mesa de corte</label>
        <main class="box-content border border-grey-800 w-full aspect-[3/2] relative overflow-clip">
          {rects.map((rect, i) => (
            <div
              key={i}
              class="bg-rustic-red-800 absolute border-2 border-rustic-red-400"
              style={{
                width: rect.width,
                height: rect.height,
                top: rect.y,
                left: rect.x,
              }}
            />
          ))}
        </main>
      </div>
    </div>
  );
}

render(<App />, document.getElementById("app")!);
