import { useState } from "react";
import { useConnectionStatus, useAddress } from "@thirdweb-dev/react";
import StatisticButton from "../components/StatisticsButton";
import ClaimReward from "../components/ClaimRewardButton";
import UserTableInformations from "../components/UserTableInformations";

export default function UserProfile() {
    const [articleIdValue, setArticleIdValue] = useState('');

    const handleArticleIdChange = (e) => {
        setArticleIdValue(e.target.value);
    };

    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    const address = useAddress();

    // State to store statistics
    const [statistics, setStatistics] = useState([]);

    return (
        <div className="flex flex-col min-h-screen">
            {isWalletConnected ? (
                <div className="grid grid-rows-5 h-96">
                    {/* Row 1 */}
                    <p className="text-4xl font-medium mx-auto mt-10">Welcome {address}!</p>
                    {/* Row 2 */}
                    <p className="text-2xl font-small mx-20 mt-10">Voted for an article and the vote is closed? Insert the article id for which you want to claim your reward and click on the button to know if you can!</p>
                    {/* Row 3 */}
                    <div className="grid grid-cols-3">
                        <div className="mt-10 ml-20">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Insert the Article Id</span>
                                </div>
                                <input className="input input-primary w-full max-w-xs" type="text" placeholder="Article Id" value={articleIdValue} onChange={handleArticleIdChange}/>
                            </label>
                        </div>
                        <div className="flex mt-20 h-10">
                            <ClaimReward articleId={articleIdValue} />
                        </div>
                    </div>
                    {/* Row 4 */}
                    <div>
                        <div className="grid grid-cols-2">
                            <p className="text-2xl font-small mx-20 w-full mt-28">Curious to know your statistics? Click on the button to fill the table</p>
                            {/* Pass setStatistics function to update statistics */}
                            <div className="flex mx-32 h-10 mt-28">
                                <StatisticButton userId={address} setStatistics={setStatistics} />
                            </div>
                        </div>
                    </div>
                    {/* Row 5 */}
                    <div className="mx-20 mt-28">
                        {/* Pass computed statistics to UserTableInformations */}
                        <UserTableInformations
                            authorReputation={statistics[0]}
                            readerReputation={statistics[1]}
                            publishPrice={statistics[2]}
                            votePrice={statistics[3]}
                            maximumBoost={statistics[4]}
                        />
                    </div>
                </div>
            ) : (
                    <p className="flex text-4xl font-medium mx-auto mt-10">Connect your wallet to see your profile!</p>
                )}
        </div>
    );
}
