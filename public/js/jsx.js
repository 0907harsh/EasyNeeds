'use strict';
class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }
  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }
    return (
      <button onClick={() => this.setState({ liked: true }) }>
        Like
      </button>
    );
  }
}
let domContainer = document.querySelector('#like_button_container');
ReactDOM.render(<LikeButton />, domContainer);
// import 'bootstrap/dist/css/bootstrap.min.css';
// import App from './App';
// ReactDOM.render( /*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement(App, null)), document.getElementById('root'));