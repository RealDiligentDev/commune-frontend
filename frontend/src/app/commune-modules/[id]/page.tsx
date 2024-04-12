"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { FaUsers } from "react-icons/fa"
import { FaArrowLeft, FaDiscord } from "react-icons/fa6"
import { FaXTwitter } from "react-icons/fa6"
import { GiProfit } from "react-icons/gi"
import { RiAiGenerate } from "react-icons/ri"
import { SiBlockchaindotcom } from "react-icons/si"
import { TbWorld } from "react-icons/tb"
import Verified from "../verified"
import StakingModal from "@/components/atoms/modal/stake"
import { usePolkadot } from "@/context"
import { numberWithCommas } from "@/utils/numberWithCommas"
import { formatTokenPrice } from "@/utils/tokenPrice"
import communeModels from '@/utils/validatorData.json'
import Style from '../commune-module.module.css'
import classnames from "classnames"
import { CheckOutlined, CopyOutlined } from "@ant-design/icons"
import { Button } from "antd"

interface ModuleColors {
    [key: string]: string;
}

const ValidatorDetailPage = () => {

    const params = useParams()

    const validatorData = communeModels.find(item => item.key === params?.id)

    const [copiedValidatorKey, setCopiedValidatorKey] = useState(false);
    const [copiedNetworkUrl, setCopiedNetworkUrl] = useState(false)
    const [copiedModuleName, setCopiedModuleName] = useState(false)
    const [stakeModuleAmount, setStakeModuleAmount] = useState(0)

    const copyToClipboardValidatorKey = async (text: string | undefined) => {
        try {
            if (text) {
                await navigator.clipboard.writeText(text);
                setCopiedValidatorKey(true);
            }
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const copyToClipboardNetworkUrl = async (text: string | undefined) => {
        try {
            if (text) {
                await navigator.clipboard.writeText(text);
                setCopiedNetworkUrl(true);
            }
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const copyToClipboardModuleAddress = async (text: string | undefined) => {
        try {
            if (text) {
                await navigator.clipboard.writeText(text);
                setCopiedModuleName(true);
            }
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const { isConnected } = usePolkadot()
    const router = useRouter()
    const [stakingOpen, setStakingOpen] = useState(false)

    const moduleColors: ModuleColors = {
        vali: '#FF5733', // Red
        model: '#33FF57', // Green
        storage: '#3357FF', // Blue
        openai: 'rgb(51, 255, 87)'
        // Add more module-color mappings as needed
    };

    const getColorForModule = (moduleName: string): string => {
        if (moduleName.includes('vali')) {
            return moduleColors['vali'] || '#000'; // Color for 'vali'
        } else if (moduleName.includes('model')) {
            return moduleColors['model'] || '#000'; // Color for 'model'
        } else if (moduleName.includes('storage')) {
            return moduleColors['storage'] || '#000'; // Color for 'storage'
        } else if (moduleName.includes('openai')) {
            return moduleColors['openai'] || '#000'; // Color for 'openai'
        } else {
            return '#000'; // Default color is black
        }
    };

    return (
        <div className="w-[97%] px-3 md:px-0 mx-auto mb-4">
            <div className="flex py-5 items-center gap-x-3">
                <button
                    className="border-2 p-2 rounded-lg cursor-pointer"
                    onClick={() => router.push("/commune-modules")}
                >
                    <FaArrowLeft className="h-[53px] w-[50px]" />
                </button>

                <div className="flex border-[1px] rounded-lg bg-[rgb(239 246 255)] p-3 w-[96%] items-center justify-around">
                    <span className="font-semibold flex items-center gap-x-2 mr-2" style={{ fontSize: '32px' }}>
                        {
                            validatorData?.name
                        }{" "}

                        {
                            validatorData?.isVerified && (
                                <Verified
                                    isGold={
                                        validatorData.key === process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR
                                    }
                                />
                            )
                        }

                        {
                            copiedModuleName ? <CheckOutlined /> : <CopyOutlined onClick={() => copyToClipboardModuleAddress(validatorData?.name)} />
                        }

                    </span>

                    <span className="card-validator-data truncate" style={{ fontSize: '32px' }}>
                        {validatorData?.key}
                        {
                            copiedValidatorKey ? <CheckOutlined className="ml-2" /> : <CopyOutlined className="ml-2" onClick={() => copyToClipboardValidatorKey(validatorData?.key)} />
                        }
                    </span>

                    <span className="card-validator-data mr-2" style={{ fontSize: '32px' }}>
                        {validatorData?.address}
                        {copiedNetworkUrl ? <CheckOutlined className="ml-2" /> : <CopyOutlined className="ml-2" onClick={() => copyToClipboardNetworkUrl(validatorData?.address)} />}
                    </span>
                </div>

            </div>

            <div className="flex gap-x-5 flex-col items-center lg:items-start lg:flex-row">
                <div className="p-4 w-[500px]">

                    <div className={classnames(Style.cardClass, "h-64 w-64 flex justify-center items-center rounded-3xl mx-auto dark:text-black bg-[#1f2330] duration-300 transition-all hover:opacity-75 hover:border-primary shadow-xl border-[1px] border-[#f2f2f2] cursor-pointer")}
                        style={{ backgroundColor: validatorData && getColorForModule(validatorData.name), width: '100%', height: '320px' }}
                    >
                        <span className="dark:text-white" style={{ fontSize: '46px' }}>{validatorData?.name}</span>
                    </div>
                    {
                        validatorData?.key ===
                        process.env.NEXT_PUBLIC_COMSTAT_VALIDATOR && (
                            <p className="text-md mt-[1.5rem] text-center" style={{ fontSize: '25px' }}>
                                All Statistics of CommuneAI at one place. Staking
                                infrastructure, prices, validators, miners, swap, bridge,
                                exchange for $COMAI
                            </p>
                        )
                    }

                    <div className="flex justify-center gap-x-4 mt-[0.5rem]">
                        <a href="" target="_blank">
                            <FaDiscord size={22} />
                        </a>
                        <a href="" target="_blank">
                            <FaXTwitter size={22} />
                        </a>
                        <a href="" target="_blank">
                            <TbWorld size={22} />
                        </a>
                    </div>

                    <div className="mt-[1rem]">
                        {
                            !isConnected && (
                                <p className="text-[16px] mb-1 italic text-center text-red-400">
                                    You have not connected your wallet.
                                </p>
                            )
                        }

                        <div className='flex border rounded-[0.5rem] bg-[#fff] items-center justify-evenly p-5 w-full'>
                            <input value={stakeModuleAmount} className='border-none outline-none appearance-none w-[80%] bg-[#fff]' type='text' onChange={({ target: { value } }) => {
                                if (!isNaN(parseFloat(value))) {
                                    setStakeModuleAmount(parseFloat(value));
                                }
                            }} />
                            COMAI
                        </div>

                        <Button
                            size="large"
                            type="primary"
                            className="w-full justify-center cursor-pointer font-[40px] mt-4"
                            disabled={!isConnected}
                            onClick={() => setStakingOpen(true)}
                            style={{ fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
                        >
                            <span className="font-[40px]">Stake Now</span>
                        </Button>
                    </div>


                </div>

                <div className="flex gap-4 flex-col flex-1 mt-8">
                    <div className="flex lg:space-x-3 flex-wrap">

                        <div className="border-[1px] rounded-lg bg-[rgb(239 246 255)] p-3 w-[32%] h-[210px]">
                            <p className="card-validator-heading flex items-center justify-start ">
                                <GiProfit size={20} className="mr-2" style={{ fontSize: '40px' }} />
                                <span style={{ fontSize: '40px' }}>Subnet ID</span>
                            </p>
                            <span className="card-validator-data dark:text-white" style={{ fontSize: '40px' }}>
                                {validatorData?.subnet_id}
                            </span>
                        </div>

                        <div className="border-[1px] rounded-lg bg-[rgb(239 246 255)] p-3 w-[32%] h-[210px]">
                            <p className="card-validator-heading flex items-center justify-start ">
                                <GiProfit size={20} className="mr-2" style={{ fontSize: '40px' }} />
                                <span style={{ fontSize: '40px' }}>Balance</span>
                            </p>
                            <span className="card-validator-data dark:text-white" style={{ fontSize: '40px' }}>
                                {validatorData?.balance}
                            </span>
                        </div>

                        <div className="border-[1px] rounded-lg bg-[rgb(239 246 255)] p-3 w-[33%] h-[210px]">
                            <p className="card-validator-heading flex items-center justify-start ">
                                <GiProfit size={20} className="mr-2" style={{ fontSize: '40px' }} />
                                <span style={{ fontSize: '40px' }}>APY</span>
                            </p>
                            <span className="card-validator-data dark:text-white" style={{ fontSize: '40px' }}>
                                {validatorData?.apy?.toFixed(2)}%
                            </span>
                        </div>
                    </div>

                    <div className="container mt-4">
                        <div className="flex lg:space-x-3 flex-wrap">
                            <div className="border-[1px] rounded-lg bg-[rgb(239 246 255)] p-3 w-[32%] h-[210px]">
                                <p className="card-validator-heading flex items-center justify-start">
                                    <SiBlockchaindotcom size={20} className="mr-2" />
                                    <span style={{ fontSize: '40px' }}>Total Staked</span>
                                </p>
                                <span className="card-validator-data dark:text-white" style={{ fontSize: '40px' }}>
                                    {numberWithCommas(
                                        formatTokenPrice({
                                            amount: Number(validatorData?.stake),
                                        }),
                                    )}{" "}
                                    COMAI
                                </span>
                            </div>
                            <div className="border-[1px] rounded-lg bg-[rgb(239 246 255)] p-3 w-[32%] h-[210px]">
                                <p className="card-validator-heading flex items-center justify-start">
                                    <SiBlockchaindotcom size={20} className="mr-2" />
                                    <span style={{ fontSize: '40px' }}>Registration Block</span>
                                </p>
                                <span className="card-validator-data dark:text-white" style={{ fontSize: '40px' }}>
                                    {validatorData?.regblock}
                                </span>
                            </div>

                            <div className="border-[1px] rounded-lg bg-[rgb(239 246 255)] p-3 w-[33%] h-[210px]">
                                <p className="card-validator-heading flex items-center justify-start">
                                    <FaUsers size={20} className="mr-2" />
                                    <span style={{ fontSize: '40px' }}>Total Stakers</span>
                                </p>
                                <span className="card-validator-data dark:text-white" style={{ fontSize: '40px' }}>
                                    {validatorData?.total_stakers}
                                </span>
                            </div>

                        </div>

                        <div className="flex flex-wrap lg:space-x-3 mt-6">

                            <div className="border-[1px] rounded-lg bg-[rgb(239 246 255)] p-3 w-[32%] h-[210px]">
                                <p className="card-validator-heading flex items-center justify-start ml-1">
                                    <RiAiGenerate size={20} />
                                    <span className="ml-2" style={{ fontSize: '40px' }}>Incentive</span>
                                </p>
                                <span className="card-validator-data dark:text-white" style={{ fontSize: '40px' }}>
                                    {validatorData?.incentive}
                                </span>
                            </div>
                            <div className="border-[1px] rounded-lg bg-[rgb(239 246 255)] p-3 w-[32%] h-[210px]">
                                <p className="card-validator-heading flex items-center justify-start">
                                    <RiAiGenerate size={20} className="mr-2" />
                                    <span style={{ fontSize: '40px' }}>Emission per 100 blocks</span>
                                </p>
                                <span className="card-validator-data dark:text-white" style={{ fontSize: '40px' }}>
                                    {numberWithCommas(
                                        formatTokenPrice({
                                            amount: Number(validatorData?.emission),
                                        }),
                                    )}{" "}
                                </span>
                            </div>

                            <div className="border-[1px] rounded-lg bg-[rgb(239 246 255)] p-3 w-[33%] h-[210px]">
                                <p className="card-validator-heading flex items-center justify-start">
                                    <RiAiGenerate size={20} className="mr-2" />
                                    <span style={{ fontSize: '40px' }}>Dividends</span>
                                </p>
                                <span className="card-validator-data dark:text-white" style={{ fontSize: '40px' }}>
                                    {validatorData?.dividends}
                                </span>
                            </div>
                        </div>

                        <StakingModal
                            open={stakingOpen}
                            setOpen={setStakingOpen}
                            validatorId={String(params?.id)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ValidatorDetailPage
