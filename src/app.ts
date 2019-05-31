import {Menu} from "./views";

class App {
    public async run() {
        const menu = new Menu();

        await menu.run();
    }
}

export default App;
