import MessageHandler from "../message-handler"

const MainLayout = ({ children, isFullscreen = false, messages }: { children?: any, isFullscreen?: boolean, messages?: any }) => {
    return <>
        <div className="layout layout--main">
            <div className="layout layout__body">
                {isFullscreen ? null : <div className="layout__box" />}
                {children}

            </div>
        </div>
        <MessageHandler messages={messages} />
    </>
}

export default MainLayout;