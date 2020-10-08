const RichText = ({ content, textAlign = "left", fontSize = 18, className = "" }) => {
    const style: any = {
        textAlign,
        marginTop: 10,
        wordBreak: "break-word",
        wordWrap: "break-word",
        fontSize,
    };
    return <div
        style={style} className={className} dangerouslySetInnerHTML={{ __html: content }} >
    </div>
}

export default RichText;