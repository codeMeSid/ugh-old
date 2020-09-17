import { Component } from "react";
import Message from "./message";


interface MHProps {
    messages: Array<{
        message: string,
        type: string
    }>
}


class MessageHandler extends Component<MHProps> {
    state = {
        messages: this.props.messages || []
    }

    componentDidUpdate(prevProps) {
        const { messages } = prevProps;
        const { messages: messagesArray } = this.props;
        if (JSON.stringify(messages) !== JSON.stringify(messagesArray)) {
            this.setState({ messages: messagesArray ? messagesArray : [] })
        }

    }

    onClickHandler(i: number) {
        this.setState((prevState: any) => {
            const updatedMessage = prevState.messages.filter((_, index) => i !== index);
            return {
                messages: updatedMessage
            }
        })
    }

    render() {
        const { messages } = this.state;
        return <div className="message_handler">
            {
                (messages ? messages : []).map(({ message, type }, index) => <Message key={Math.random()} text={message} type={type} onClick={() => this.onClickHandler(index)} />)
            }
        </div>
    }
}

// const MessageHandler = ({ messageArray = [] }: { messageArray: Array<{ message: string, type?: string }> }) => {
//     const [messages, setMessages] = useState(messageArray);
//     const onClickHandler = (i: number) => {
//         
//         setMessages(updatedMessage);
//     }
//     useEffect(() => {
//         setMessages(messageArray);
//     }, [messageArray])
//     return 
// }


export default MessageHandler;