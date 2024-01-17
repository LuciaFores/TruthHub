import { useState } from "react";
import { useConnectionStatus, useAddress } from "@thirdweb-dev/react";
import StatisticButton from "../components/StatisticsButton";
import UserTableInformations from "../components/UserTableInformations";

export default function UserProfile() {
    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    const address = useAddress();

    // State to store statistics
    const [statistics, setStatistics] = useState([]);

    return (
        <div className="flex flex-col min-h-screen">
            {isWalletConnected ? (
                <div className="grid grid-rows-3 h-96">
                    <p className="text-4xl font-medium mx-auto mt-10">Welcome {address}!</p>
                    <div className="grid grid-cols-2">
                        <p className="text-2xl font-small mx-20 mt-10">Curious to know your statistics? Click on the button to fill the table</p>
                        {/* Pass setStatistics function to update statistics */}
                        <StatisticButton userId={address} setStatistics={setStatistics} />
                    </div>
                    <div className="mx-20 mt-10">
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
