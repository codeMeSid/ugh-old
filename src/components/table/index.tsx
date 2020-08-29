import Skeleton from 'react-loading-skeleton';

const Table = ({ headers = [], data = [] }: { headers: Array<string>, data: Array<any> }) => <table>
    <thead>
        <tr>
            {headers.map(header => <th key={header}>{header}</th>)}
        </tr>
    </thead>
    <tbody>
        {data.length === 0 ?
            Array(10).fill(0).map(() => {
                return <tr key={Math.random() * 1000}>{
                    Array(headers.length).fill(0).map(() => {
                        return <td key={Math.random() * 1000}><Skeleton /></td>
                    })}</tr>
            })

            : data.map((points: any[]) => {
                return <tr key={Math.random() * 1000}> {points.map((point: any) => {
                    return <td key={Math.random() * 1000}>{point}</td>
                })}</tr>
            })}
    </tbody>
</table>;

export default Table;