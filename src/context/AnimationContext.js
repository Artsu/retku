import React from 'react'

const AnimationContext = React.createContext({
  nintendoIsOpen: true,
  cartIsDown: false,
  contentIsVisible: false,
  buttonDisabled: true,
})

class AnimationProvider extends React.Component {
  state = {
    nintendoIsOpen: true,
    cartIsDown: false,
    contentIsVisible: false,
    buttonDisabled: true,
  }

  componentDidMount() {
    setTimeout(() => {
      this.toggleNes()
    }, 1000)
  }

  toggleNes = () => {
    if (this.state.nintendoIsOpen) {
      this.closeNes()
    } else {
      this.openNes()
    }
  }

  openNes = () => {
    this.setState({
      buttonDisabled: true,
      nintendoIsOpen: true,
    })
    setTimeout(() => {
      this.setState({
        cartIsDown: false,
      })
      setTimeout(() => {
        this.setState({
          buttonDisabled: false,
          contentIsVisible: true,
        })
      }, 800)
    }, 1000)
  }

  closeNes = () => {
    this.setState({
      buttonDisabled: true,
      cartIsDown: true,
    })
    setTimeout(() => {
      this.setState({
        nintendoIsOpen: false,
      })
      setTimeout(() => {
        this.setState({
          buttonDisabled: false,
          contentIsVisible: true,
        })
      }, 800)
    }, 800)
  }

  render() {
    const { children } = this.props
    return (
      <AnimationContext.Provider value={this.state}>
        {children}
      </AnimationContext.Provider>
    )
  }
}
export default AnimationContext
export { AnimationProvider }
