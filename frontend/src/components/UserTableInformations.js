import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export default function UserTableInformations({ authorReputation, readerReputation, publishPrice, votePrice, maximumBoost }) {
    const isAuthor = authorReputation > 0;

    return(
        <div className="overflow-x-auto">
            <table className="table table-compact">
                {/* head */}
                <thead>
                <tr>
                    <th className="border">
                        Attribute
                        <div className="tooltip tooltip-right ml-4" data-tip="Hover to get informations about the attribute">
                            <button><FontAwesomeIcon icon={faCircleInfo} /></button>
                        </div>
                    </th>
                    <th className="border">Value</th>
                </tr>
                </thead>
                <tbody>
                {/* row 1 */}
                <tr>
                    <th className="border">
                        <div className="font-bold">
                            Author Reputation
                            <div className="tooltip tooltip-right ml-4" data-tip="Your reputation as an author (it goes from 1 to 101)">
                                <button><FontAwesomeIcon icon={faCircleInfo} /></button>
                            </div>
                        </div>
                    </th>
                    <td className="border">
                        {isAuthor ? authorReputation : "Not an Author"}
                    </td>
                </tr>
                {/* row 2 */}
                <tr>
                    <th className="border">
                        <div className="font-bold">
                            Reader Reputation
                            <div className="tooltip tooltip-right ml-4" data-tip="Your reputation as a reader (it goes from 1 to 101)">
                                <button><FontAwesomeIcon icon={faCircleInfo} /></button>
                            </div>
                        </div>
                    </th>
                    <td className="border">
                        {readerReputation}
                    </td>
                </tr>
                {/* row 3 */}
                <tr>
                    <th className="border">
                        <div className="font-bold">
                            Publish Price
                            <div className="tooltip tooltip-right ml-4" data-tip="Minimum amount of Wei to pay to publish an article">
                                <button><FontAwesomeIcon icon={faCircleInfo} /></button>
                            </div>
                        </div>
                    </th>
                    <td className="border">
                        {isAuthor ? publishPrice : "Not an Author"}
                    </td>
                </tr>
                {/* row 4 */}
                <tr>
                    <th className="border">
                        <div className="font-bold">
                            Vote Price
                            <div className="tooltip tooltip-right ml-4" data-tip="Minimum amount of Wei to pay to vote an article">
                                <button><FontAwesomeIcon icon={faCircleInfo} /></button>
                            </div>
                        </div>
                    </th>
                    <td className="border">
                        {votePrice}
                    </td>
                </tr>
                {/* row 5 */}
                <tr>
                    <th className="border">
                        <div className="font-bold">
                            Maximum Boost
                            <div className="tooltip tooltip-right ml-4" data-tip="Maximum amount of expendable tokens to boost the vote weight (it can at most be doubled)">
                                <button><FontAwesomeIcon icon={faCircleInfo} /></button>
                            </div>
                        </div>
                    </th>
                    <td className="border">
                        {maximumBoost}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}