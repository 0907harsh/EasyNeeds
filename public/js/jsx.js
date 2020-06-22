'use strict';

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false
    };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return /*#__PURE__*/React.createElement("button", {
      onClick: () => this.setState({
        liked: true
      })
    }, "Like");
  }

}

let domContainer = document.querySelector('#like_button_container');
ReactDOM.render( /*#__PURE__*/React.createElement(LikeButton, null), domContainer);