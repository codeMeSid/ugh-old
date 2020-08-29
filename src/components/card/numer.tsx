import { Component } from 'react'
import Skeleton from 'react-loading-skeleton';

interface Props {
    title: string,
    count: number
}

export default class NumberCard extends Component<Props> {
    state = {
        count: 0
    }
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.counter()
    }

    counter() {
        if (this.state.count < this.props.count) {
            setTimeout(() =>
                this.setState((ps: any) => ({ count: ps.count + 1 }), this.counter)
                , Math.random() * 50)
        }
    }

    render() {
        return <div className="card card--number">
            <div className="card__title">{this.props.title}</div>
            {
                !this.props.count
                    ? <Skeleton />
                    : <div className="card__count">{this.state.count}</div>
            }
        </div>
    }
}