import { Component } from 'react'
import Skeleton from 'react-loading-skeleton';

interface Props {
    title: string,
    count: number
}

export default class NumberCard extends Component<Props> {
    state = {
        count: 0,
        isCounting: false
    }
    constructor(props) {
        super(props)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.count !== this.props.count) this.setState({ isCounting: true }, this.counter);
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
                !this.state.isCounting
                    ? <Skeleton width={100} height={100} />
                    : <div className="card__count">{this.state.count}</div>
            }
        </div>
    }
}