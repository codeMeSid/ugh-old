const Tooltip = ({ title, children }) => <div className="tooltip">
    <div className="tooltip__title">{title}</div>
    <div className="tooltip__body">{children}</div>
</div>


export default Tooltip;