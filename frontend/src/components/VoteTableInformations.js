export default function UserTableInformations({ ethVotePrice }) {
        return(
        <div className="overflow-x-auto">
            <table className="table table-compact">
                {/* head */}
                <thead>
                <tr>
                    <th className="border">Reputation</th>
                    <th className="border">Min ETH Price</th>
                    <th className="border">Vote Weight</th>
                    <th className="border">Max Veri Boost</th>
                    <th className="border">Max Boosted Vote Weight</th>
                </tr>
                </thead>
                <tbody>
                {/* row 1 */}
                <tr>
                    <td className="border">1</td>
                    <td className="border">{ethVotePrice * 2}</td>
                    <td className="border">5</td>
                    <td className="border">5</td>
                    <td className="border">10</td>
                </tr>
                {/* row 2 */}
                <tr>
                    <td className="border">51</td>
                    <td className="border">{ethVotePrice}</td>
                    <td className="border">10</td>
                    <td className="border">10</td>
                    <td className="border">20</td>
                </tr>
                {/* row 3 */}
                <tr>
                    <td className="border">101</td>
                    <td className="border">{ethVotePrice * 0.5}</td>
                    <td className="border">20</td>
                    <td className="border">20</td>
                    <td className="border">40</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}