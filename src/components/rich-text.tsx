const RichText = ({ content }) => <div
    style={{
        textAlign:"left",
        marginTop: 10,
        wordBreak: "break-all",
        wordWrap: "break-word",
        fontSize: 18,

    }} dangerouslySetInnerHTML={{ __html: content }} >
</div>

export default RichText;