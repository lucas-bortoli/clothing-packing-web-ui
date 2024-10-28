import { render } from "preact";
import "./index.css";
import Button, { IconButton } from "./Components/Button";
import Checkbox from "./Components/Checkbox";
import Icon from "./Components/Icon";

function App() {
  return (
    <div class="w-full h-full max-w-screen-sm mx-auto flex flex-col gap-2 p-2">
      <h1 class="text-2xl">Cloth Packing WebUI</h1>
      <div class="justify-center flex gap-1">
        <Button>
          <Icon name="NewLayer" />
          Iniciar nova mesa
        </Button>
        <Button>
          <Icon name="Build" />
          Confirmar mesa atual
        </Button>
      </div>
      <div>
        <IconButton iconName="Add" buttonSize="small" />
        <IconButton iconName="Refresh" />

        <Checkbox checked onCheck={() => {}} />
      </div>
    </div>
  );
}

render(<App />, document.getElementById("app")!);
