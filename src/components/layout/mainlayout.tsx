import MessageHandler from "../message-handler"

const MainLayout = ({ children, isFullscreen = false, messages }: { children?: any, isFullscreen?: boolean, messages?: Array<any> }) => {
    return <>
        <div className="layout layout--main">
            <div className="layout layout__body">
                {isFullscreen ? null : <div className="layout__box" />}
                {children}

            </div>
        </div>
        <MessageHandler messageArray={messages} />
    </>
}

export default MainLayout;