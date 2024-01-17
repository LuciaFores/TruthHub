import { Web3Button } from "@thirdweb-dev/react";
import { TruthHubAddress, TruthHubAbi } from "../contracts.js";

export default function StatisticButton({ userId, setStatistics }) {
    return (
        <Web3Button
            contractAddress={TruthHubAddress}
            contractAbi={TruthHubAbi}
            action={async (contract) => {
                const computedStatistics = [
                    await contract.call("getAuthorReputation", [userId]),
                    await contract.call("getReaderReputation", [userId]),
                    Number(await contract.call("computePublishPrice", [userId])),
                    Number(await contract.call("computeVotePrice", [userId])),
                    Number(await contract.call("computeMaximumBoost", [userId])),
                ];

                // Update statistics using setStatistics function
                setStatistics(computedStatistics);
            }}
        >
            Compute your statistics!
        </Web3Button>
    );
}
