import React from 'react'
import Header from './Header'
import Order from './Order'
import Inventory from './Inventory'
import Fish from './Fish'

import base from '../base'
import sampleFishes from '../sample-fishes'

class App extends React.Component {
  constructor () {
    super()

    // getInitialState
    this.state = {
      fishes: {},
      order: {}
    }

    this.addFish = this.addFish.bind(this)
    this.loadSampleFishes = this.loadSampleFishes.bind(this)
    this.addToOrder = this.addToOrder.bind(this)
    this.updateFish = this.updateFish.bind(this)
    this.removeFish = this.removeFish.bind(this)
  }

  componentWillMount () {
    // this runs right before the <App> is rendered
    this.ref = base.syncState(
      `${this.props.params.storeId}/fishes`,
      {
        context: this,
        state: 'fishes'
      }
    )

    // restore order from localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`)

    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  }

  componentWillUnmount () {
    base.removeBinding(this.ref)
  }

  componentWillUpdate (nextProps, nextState) {
    localStorage.setItem(
      `order-${this.props.params.storeId}`,
      JSON.stringify(nextState.order)
    )
  }

  loadSampleFishes () {
    this.setState({ fishes: sampleFishes })
  }

  addFish (fish) {
    const fishes = {...this.state.fishes}
    const timestamp = Date.now()

    fishes['fish-' + timestamp] = fish

    this.setState({ fishes })
  }

  updateFish (key, fish) {
    const fishes = {...this.state.fishes}

    fishes[key] = fish

    this.setState({ fishes })
  }

  removeFish (key) {
    const fishes = {...this.state.fishes}

    fishes[key] = null

    this.setState({ fishes })
  }

  addToOrder (key) {
    const order = {...this.state.order}
    order[key] = order[key] + 1 || 1

    this.setState({ order })
  }

  removeFromOrder (key) {
    const order = {...this.state.order}

    delete order[key]

    this.setState({ order })
  }

  render () {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {
              Object.keys(this.state.fishes)
                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
            }
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          removeFromOrder={this.removeFromOrder} />
        <Inventory
          fishes={this.state.fishes}
          loadSamples={this.loadSampleFishes}
          addFish={this.addFish}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          storeId={this.props.params.storeId} />
      </div>
    )
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired
}

export default App
