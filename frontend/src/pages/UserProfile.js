import { useState } from "react";
import { useConnectionStatus, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { TruthHubAddress } from "../contracts";
import ClaimReward from "../components/ClaimRewardButton";
import UserTableInformations from "../components/UserTableInformations";

export default function UserProfile() {
    const { contract } = useContract(TruthHubAddress);

    const [articleIdValue, setArticleIdValue] = useState('');

    const handleArticleIdChange = (e) => {
        setArticleIdValue(e.target.value);
    };

    const connectionStatus = useConnectionStatus();
    const isWalletConnected = connectionStatus === "connected";

    const address = useAddress();

    const {data: aR, isLoading: isLoadingAR} = useContractRead(contract, "getAuthorReputation", [address]);
    const {data: rR, isLoading: isLoadingrR} = useContractRead(contract, "getReaderReputation", [address]);
    const {data: pP, isLoading: isLoadingPP} = useContractRead(contract, "computePublishPrice", [address]);
    const {data: vP, isLoading: isLoadingVP} = useContractRead(contract, "computeVotePrice", [address]);
    const {data: mB, isLoading: isLoadingMB} = useContractRead(contract, "computeMaximumBoost", [address]);

    const isLoadingAll = (isLoadingAR || isLoadingrR || isLoadingPP || isLoadingVP || isLoadingMB);


    return (
        <div className="flex flex-col min-h-screen">
            {isWalletConnected ? (
                <div className="grid grid-rows-4 h-96">
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
                    <div className="mx-20 mt-28">
                        {/* Pass computed statistics to UserTableInformations */}
                        {
                            isLoadingAll ? (
                            <p className="flex mx-auto mt-10">Loading User Statistics...</p>
                            ) : (
                            <UserTableInformations
                            authorReputation={aR}
                            readerReputation={rR}
                            publishPrice={Number(pP) * 10 ** -18}
                            votePrice={Number(vP) * 10 ** -18}
                            maximumBoost={Number(mB) * 10 ** -18}
                            />
                            )
                        }
                        
                    </div>
                </div>
            ) : (
                    <p className="flex text-4xl font-medium mx-auto mt-10">Connect your wallet to see your profile!</p>
                )}
        </div>
    );
}
