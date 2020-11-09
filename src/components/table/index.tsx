import Skeleton from 'react-loading-skeleton';

const Table = ({ headers = [], data = [], hasLoader = false }: { headers: Array<{ text: string, isResponsive: boolean }>, data: Array<any>, hasLoader?: boolean }) => <table>
    <thead>
        <tr>
            {headers.map(({ text, isResponsive }) => <th key={Math.random() * 1000} className={`${isResponsive ? "table__hidden" : ""}`} >{text}</th>)}
        </tr>
    </thead>
    <tbody>
        {data.length === 0 && !hasLoader ?
            Array(10).fill(0).map(() => {
                return <tr key={Math.random() * 1000}>{
                    Array(headers.length).fill(0).map((_, index: number) => {
                        return <td key={Math.random() * 1000} className={`${headers[index].isResponsive ? "table__hidden" : ""}`} ><Skeleton /></td>
                    })}</tr>
            })

            : data.map((points: any[]) => {
                return <tr key={Math.random() * 1000}> {points.map((point: any, index: number) => {
                    return <td key={Math.random() * 1000} className={`${headers[index].isResponsive ? "table__hidden" : ""}`} >{point}</td>
                })}</tr>
            })}
    </tbody>
</table>;

export default Table;