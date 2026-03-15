import { render ,Component,Fragment} from 'src/infernos/inferno';
import { createElement} from 'src/infernos/inferno-create-element'
class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }
  render() {
    return (
      <>
        <h1>Header!</h1>
        <button onClick={() => this.setState({ counter: this.state.counter + 1 })}>
          Click me!
        </button>
        <span>Counter is at: { this.state.counter }</span>
      </>
    );
  }
}


const message = "Hello world";

render(
  <MyComponent message={ message } />,
  document.getElementById("app")
);