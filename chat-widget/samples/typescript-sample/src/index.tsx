import * as OcChatComponentPackageInfo from "@microsoft/omnichannel-chat-components/package.json";
import * as OcChatSdkPackageinfo from "@microsoft/omnichannel-chat-sdk/package.json";
import * as OcChatWidgetPackageInfo from "@microsoft/omnichannel-chat-widget/package.json";

import { LiveChatWidget, getMockChatSDKIfApplicable } from "@microsoft/omnichannel-chat-widget";
import React, { useEffect, useState } from "react";

import { CoffeeChatIconBase64 } from "../src/common/assets";
import { OmnichannelChatSDK } from "@microsoft/omnichannel-chat-sdk";
import ReactDOM from "react-dom/client";
import { defaultProps } from "../src/common/defaultProps";

const getOmnichannelChatConfig = () => {
    // Use dummy values for designer mode
    const omnichannelConfig = {
        orgId: "00000000-0000-0000-0000-000000000000",
        orgUrl: "https://designer-mode.com",
        widgetId: "00000000-0000-0000-0000-000000000000"
    };
    return omnichannelConfig;
};

const App = () => {
    // To avoid webpack 5 warning and soon obsolete code, rename the packageinfo variable
    const OcSdkPkginfo = OcChatSdkPackageinfo;
    const OcChatWidgetPkgInfo = OcChatWidgetPackageInfo;
    const OcChatComponentPkgInfo = OcChatComponentPackageInfo;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [liveChatWidgetProps, setLiveChatWidgetProps] = useState<any>();
    const omnichannelConfig = getOmnichannelChatConfig();

    useEffect(() => {
        const init = async () => {
            let chatSDK = new OmnichannelChatSDK(omnichannelConfig);
            chatSDK = getMockChatSDKIfApplicable(chatSDK, { type: "designer"});
            
            
            
            // Set the messages on the SDK - uncomment the one you want to test
            (chatSDK as any).mockActivities = [
                //acMessage,       // Adaptive card with action buttons
                //SAMessage,   // Suggested actions below a text message
                cardsMessage,    // Carousel of hero cards with "Cards" tag
                cardsMessage2    // Second carousel for tuning - simplified cards
            ];
            
            await chatSDK.initialize();
            const chatConfig = await chatSDK.getLiveChatConfig();

            const liveChatWidgetProps = {
                ...defaultProps,
                // mock: {
                //     type: "designer",
                //     mockActivities: [
                //         //acMessage,       // Adaptive card with action buttons
                //         //SAMessage,   // Suggested actions below a text message
                //         cardsMessage,    // Carousel of hero cards with "Cards" tag
                //         cardsMessage2    // Second carousel for tuning - simplified cards
                //     ]
                // },
                chatButtonProps: { // example: chat button customization overrides
                    controlProps: {
                        titleText: "Bella Chat"
                    },
                    styleProps: {
                        generalStyleProps: {
                            height: "56px",
                            width: "56px",
                            borderRadius: "50%",
                        },
                        iconStyleProps: {
                            backgroundColor: "#c5ecc5",
                            backgroundImage: `url(${CoffeeChatIconBase64})`,
                        }
                    },
                },
                headerProps: { // example: default header is being overriden with a new background color style
                    styleProps: {
                        generalStyleProps: {
                            background: "#c5ecc5"
                        }
                    }
                },
                loadingPaneProps: { // example: loading pane customization overrides
                    styleProps: {
                        generalStyleProps: {
                            backgroundColor: "#c5ecc5"
                        }
                    },
                    titleStyleProps: {
                        fontFamily: "Garamond"
                    },
                    subtitleStyleProps: {
                        fontFamily: "Garamond"
                    },
                    spinnerTextStyleProps: {
                        fontFamily: "Garamond"
                    }
                },
                webChatContainerProps: { // example: web chat customization overrides
                    webChatStyles: {
                        bubbleBackground: "white",
                        bubbleFromUserBackground: "#c5ecc5",
                        bubbleFromUserTextColor: "#051005",
                        bubbleTextColor: "#051005",
                        primaryFont: "Garamond"
                    },
                    disableMarkdownMessageFormatting: true, // setting the default to true for a known issue with markdown
                },
                styleProps: { // example: adjusting sizing and placement of the chat widget
                    generalStyles: {
                        width: "400px",
                        height: "600px",
                        bottom: "30px",
                        right: "30px"
                    }
                },
                controlProps: {
                    hidePreChatSurveyPane: true, // Disable prechat survey
                    hideStartChatButton: true // Auto-start chat, bypass chat button
                },
                chatSDK, // mandatory
                chatConfig, // mandatory
                telemetryConfig: { // mandatory for telemetry
                    chatWidgetVersion: OcChatWidgetPkgInfo.version,
                    chatComponentVersion: OcChatComponentPkgInfo.version,
                    OCChatSDKVersion: OcSdkPkginfo.version
                }
            };

            setLiveChatWidgetProps(liveChatWidgetProps);
        };

        init();
    }, []);

    return (
        <div>
            {liveChatWidgetProps && <LiveChatWidget {...liveChatWidgetProps} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <App />
);


//Adaptive card
const acMessage =
{
    type: "message",
    id: "test-activity-2",
    timestamp: new Date().toISOString(),
    channelId: "directline",
    from: {
        id: "bot-123",
        name: "Test Bot"
    },
    conversation: {
        id: "test-conversation-1"
    },
    attachments: [
        {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
                type: "AdaptiveCard",
                version: "1.3",
                body: [
                    {
                        type: "Image",
                        url: "https://picsum.photos/400/600?random=99",
                        size: "Medium"
                    },
                    {
                        type: "TextBlock",
                        text: "Welcome to Customer Support",
                        weight: "Bolder",
                        size: "Medium",
                        color: "Accent"
                    },
                    {
                        type: "TextBlock",
                        text: "Please select one of the options below:",
                        wrap: true,
                        spacing: "Medium"
                    }
                ],
                actions: [
                    {
                        type: "Action.Submit",
                        title: "📞 Technical Support",
                        data: {
                            action: "technical_support",
                            message: "I need technical help"
                        }
                    },
                    {
                        type: "Action.Submit",
                        title: "💳 Billing Questions",
                        data: {
                            action: "billing",
                            message: "I have a billing question"
                        }
                    }
                ]
            }
        }
    ]
}
    ;

//Suggested Actions message
const SAMessage = {
    type: "message",
    id: "test-activity-sa",
    timestamp: new Date().toISOString(),
    channelId: "directline",
    from: {
        id: "bot-123",
        name: "Test Bot"
    },
    conversation: {
        id: "test-conversation-1"
    },
    text: "How would you like to proceed with your request?",
    suggestedActions: {
        actions: [
            {
                type: "imBack",
                title: "📞 Call Support",
                value: "I want to call support"
            },
            {
                type: "imBack",
                title: "💬 Continue Chat",
                value: "I want to continue chatting"
            },
            {
                type: "imBack",
                title: "📧 Email Support",
                value: "I want to email support"
            },
            {
                type: "openUrl",
                title: "🌐 Visit Help Center",
                value: "https://help.microsoft.com"
            }
        ]
    },
    attachments: []
};

// carousel layout of multiple hero cards
const cardsMessage = {
    type: "message",
    id: "test-activity-carousel",
    timestamp: new Date().toISOString(),
    channelId: "directline",
    from: {
        id: "bot-123",
        name: "Test Bot"
    },
    conversation: {
        id: "test-conversation-1"
    },
    channelData: {
        tags: ["Cards", "HeroCardCarousel"]
    },
    text: "Here are our popular products:",
    attachmentLayout: "carousel",
    attachments: [
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Microsoft Surface Laptop Studio 2 - Professional Creative Powerhouse",
                subtitle: "The most powerful Surface Laptop ever created, featuring cutting-edge Intel processors, NVIDIA RTX graphics, and revolutionary touchscreen capabilities. Now with Windows 11 Pro and enhanced security features for professional creators and developers.",
                images: [
                    {
                        url: "https://picsum.photos/500/800?random=1"
                    }
                ],
                buttons: [
                    {
                        type: "openUrl",
                        title: "🌐 Learn More",
                        value: "https://www.microsoft.com/surface/devices/surface-laptop-studio"
                    },
                    {
                        type: "imBack",
                        title: "🛒 Add to Cart",
                        value: "Add Surface Laptop Studio to cart"
                    },
                    {
                        type: "imBack",
                        title: "💰 Get Quote",
                        value: "Get Surface Laptop Studio quote"
                    }
                ]
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Surface Pro 9",
                subtitle: "The tablet that can replace your laptop.",
                images: [
                    {
                        url: "https://picsum.photos/800/300?random=2"
                    }
                ],
                buttons: [
                    {
                        type: "openUrl",
                        title: "📱 Learn More",
                        value: "https://www.microsoft.com/surface/devices/surface-pro-9"
                    }
                ]
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Xbox Series X",
                subtitle: "The fastest, most powerful Xbox ever.",
                images: [
                    {
                        url: "https://picsum.photos/200/500?random=3"
                    }
                ],
                buttons: []
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Microsoft 365",
                subtitle: "Productivity apps and cloud services.",
                images: [
                    {
                        url: "https://picsum.photos/1000/400?random=4"
                    }
                ],
                buttons: [
                    {
                        type: "openUrl",
                        title: "🚀 Subscribe",
                        value: "https://www.microsoft.com/microsoft-365"
                    },
                    {
                        type: "imBack",
                        title: "📚 Learn More",
                        value: "Tell me about Microsoft 365"
                    }
                ]
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Microsoft Teams Premium - Advanced Collaboration Platform",
                subtitle: "Experience next-generation collaboration with advanced meeting features, intelligent noise cancellation, real-time transcription, AI-powered insights, custom backgrounds, and enterprise-grade security. Perfect for hybrid work environments and large-scale organizations requiring sophisticated communication tools.",
                images: [
                    {
                        url: "https://picsum.photos/400/1000?random=5"
                    }
                ],
                buttons: [
                    {
                        type: "openUrl",
                        title: "✨ Get Started",
                        value: "https://www.microsoft.com/microsoft-teams/premium"
                    },
                    {
                        type: "imBack",
                        title: "📊 Compare Plans",
                        value: "Compare Teams plans"
                    },
                    {
                        type: "imBack",
                        title: "🎯 Free Trial",
                        value: "Start Teams Premium trial"
                    }
                ]
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Azure Cloud Services",
                subtitle: "Scalable cloud computing platform.",
                images: [
                    {
                        url: "https://picsum.photos/100/100?random=6"
                    }
                ],
                buttons: [
                    {
                        type: "openUrl",
                        title: "☁️ Start Free",
                        value: "https://azure.microsoft.com/free"
                    }
                ]
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Windows 11 Pro",
                subtitle: "The operating system for modern business.",
                images: [
                    {
                        url: "https://picsum.photos/600/200?random=7"
                    }
                ],
                buttons: []
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Microsoft HoloLens 2 - Mixed Reality Innovation for Enterprise",
                subtitle: "Revolutionary mixed reality headset designed for enterprise solutions, featuring advanced holographic technology, spatial computing capabilities, hand tracking, eye tracking, and voice commands. Transform your business operations with immersive 3D visualizations, remote assistance, and collaborative holographic experiences that bridge the physical and digital worlds.",
                images: [
                    {
                        url: "https://picsum.photos/300/900?random=8"
                    }
                ],
                buttons: [
                    {
                        type: "openUrl",
                        title: "🥽 Explore",
                        value: "https://www.microsoft.com/hololens"
                    },
                    {
                        type: "imBack",
                        title: "📋 Request Demo",
                        value: "Request HoloLens demo"
                    }
                ]
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Power BI Pro",
                subtitle: "Business analytics and data visualization.",
                images: [
                    {
                        url: "https://picsum.photos/700/350?random=9"
                    }
                ],
                buttons: [
                    {
                        type: "openUrl",
                        title: "⚡ Try Free",
                        value: "https://powerbi.microsoft.com"
                    },
                    {
                        type: "imBack",
                        title: "🎓 Schedule Training",
                        value: "Schedule Power BI training"
                    },
                    {
                        type: "imBack",
                        title: "💡 Get Support",
                        value: "Get Power BI support"
                    }
                ]
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "GitHub Copilot",
                subtitle: "AI-powered coding assistant for developers.",
                images: [
                    {
                        url: "https://picsum.photos/150/800?random=10"
                    }
                ],
                buttons: [
                    {
                        type: "openUrl",
                        title: "🤖 Get Started",
                        value: "https://github.com/features/copilot"
                    }
                ]
            }
        }
    ]
};

// Second carousel for tuning - simplified cards
const cardsMessage2 = {
    type: "message",
    id: "test-activity-carousel-2",
    timestamp: new Date().toISOString(),
    channelId: "directline",
    from: {
        id: "bot-123",
        name: "Test Bot"
    },
    conversation: {
        id: "test-conversation-1"
    },
    channelData: {
        tags: ["Cards", "HeroCardCarousel"]
    },
    text: "Here are our featured products:",
    attachmentLayout: "carousel",
    attachments: [
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Surface Laptop Studio",
                images: [
                    {
                        url: "https://picsum.photos/500/800?random=11"
                    }
                ]
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Surface Pro 9",
                images: [
                    {
                        url: "https://picsum.photos/800/300?random=12"
                    }
                ]
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Xbox Series S",
                images: [
                    {
                        url: "https://picsum.photos/200/500?random=13"
                    }
                ]
            }
        },
        {
            contentType: "application/vnd.microsoft.card.hero",
            content: {
                title: "Office 365",
                images: [
                    {
                        url: "https://picsum.photos/1000/400?random=14"
                    }
                ]
            }
        }
    ]
};