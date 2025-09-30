import { proto } from '../../WAProto';

declare namespace imup {
    interface MediaUploadOptions {
        fileEncSha256?: Buffer;
        mediaType?: string;
        newsletter?: boolean;
    }

    type WAMediaUploadFunction = (
        stream: Buffer | NodeJS.ReadableStream, 
        options?: MediaUploadOptions
    ) => Promise<{ url: string; directPath: string }>;

    interface WAMessageContentGenerationOptions {
        upload?: WAMediaUploadFunction;
        mediaCache?: any;
        options?: any;
        logger?: any;
    }

    interface StickerMessage {
        url: string;
        fileSha256: Buffer | string;
        fileEncSha256: Buffer | string;
        mediaKey: Buffer | string;
        mimetype: string;
        directPath: string;
        fileLength: number | string;
        mediaKeyTimestamp: number | string;
        isAnimated?: boolean;
        stickerSentTs?: number | string;
        isAvatar?: boolean;
        isAiSticker?: boolean;
        isLottie?: boolean;
    }

    interface PaymentMessage {
        amount: number;
        currency?: string;
        from?: string;
        expiry?: number;
        sticker?: { stickerMessage: StickerMessage };
        note?: string;
        background?: {
            id?: string;
            fileLength?: string;
            width?: number;
            height?: number;
            mimetype?: string;
            placeholderArgb?: number;
            textArgb?: number;
            subtextArgb?: number;
        };
    }

    interface ProductMessage {
        title: string;
        description: string;
        thumbnail: Buffer | { url: string };
        productId: string;
        retailerId: string;
        url: string;
        body?: string;
        footer?: string;
        buttons?: proto.Message.InteractiveMessage.INativeFlowButton[];
        priceAmount1000?: number | null;
        currencyCode?: string;
    }

    interface InteractiveMessage {
        title: string;
        footer?: string;
        thumbnail?: string;
        image?: string | Buffer | { url: string };
        video?: string | Buffer | { url: string };
        document?: Buffer;
        mimetype?: string;
        fileName?: string;
        jpegThumbnail?: Buffer;
        contextInfo?: {
            mentionedJid?: string[];
            forwardingScore?: number;
            isForwarded?: boolean;
            forwardedNewsletterMessageInfo?: proto.Message.ContextInfo.ForwardedNewsletterMessageInfo;
            externalAdReply?: {
                title?: string;
                body?: string;
                mediaType?: number;
                thumbnailUrl?: string;
                mediaUrl?: string;
                sourceUrl?: string;
                showAdAttribution?: boolean;
                renderLargerThumbnail?: boolean;
                [key: string]: any;
            };
            [key: string]: any;
        };
        externalAdReply?: {
            title?: string;
            body?: string;
            mediaType?: number;
            thumbnailUrl?: string;
            mediaUrl?: string;
            sourceUrl?: string;
            showAdAttribution?: boolean;
            renderLargerThumbnail?: boolean;
            [key: string]: any;
        };
        buttons?: proto.Message.InteractiveMessage.INativeFlowButton[];
        nativeFlowMessage?: {
            messageParamsJson?: string;
            buttons?: proto.Message.InteractiveMessage.INativeFlowButton[];
            [key: string]: any;
        };
    }

    interface AlbumItem {
        image?: { url: string; caption?: string };
        video?: { url: string; caption?: string };
    }

    interface EventMessageLocation {
        degreesLatitude: number;
        degreesLongitude: number;
        name: string;
    }

    interface EventMessage {
        isCanceled?: boolean;
        name: string;
        description: string;
        location?: EventMessageLocation;
        joinLink?: string;
        startTime?: string | number;
        endTime?: string | number;
        extraGuestsAllowed?: boolean;
    }
    
    interface PollVote {
        optionName: string;
        optionVoteCount: string | number;
    }
    
    interface PollResultMessage {
        name: string;
        pollVotes: PollVote[];
        newsletter?: {
            newsletterName: string;
            newsletterJid: string;
        };
    }

    interface StatusMentionMessage {
        image?: string | { url: string };
        video?: string | { url: string };
        caption: string;
        mentions: string[];
    }

    interface OrderMessage {
        thumbnail?: Buffer | string,
        itemCount?: string | number,
        message: string,
        orderTitle: string,
        totalAmount1000?: string | number,
        totalCurrencyCode?: string
    }
 
    interface MessageContent {
        requestPaymentMessage?: PaymentMessage;
        productMessage?: ProductMessage;
        interactiveMessage?: InteractiveMessage;
        albumMessage?: AlbumItem[];
        eventMessage?: EventMessage;
        pollResultMessage?: PollResultMessage;
        statusMentionMessage?: StatusMentionMessage;
        orderMessage?: OrderMessage;
        sender?: string;
    }

    interface MessageOptions {
        quoted?: proto.IWebMessageInfo;
        filter?: boolean;
    }

    interface Utils {
        prepareWAMessageMedia: (media: any, options: WAMessageContentGenerationOptions) => Promise<any>;
        generateWAMessageContent: (content: any, options: WAMessageContentGenerationOptions) => Promise<any>;
        generateWAMessageFromContent: (jid: string, content: any, options?: any) => Promise<any>;
        generateWAMessage: (jid: string, content: any, options?: any) => Promise<any>;
        generateMessageID: () => string;
    }
}

declare class imup {
    constructor(
        utils: imup.Utils,
        waUploadToServer: imup.WAMediaUploadFunction,
        relayMessageFn?: (jid: string, content: any, options?: any) => Promise<any>
    );
    
    detectType(content: imup.MessageContent): 'PAYMENT' | 'PRODUCT' | 'INTERACTIVE' | 'ALBUM' | 'EVENT' | 'POLL_RESULT' | 'STATUS_MENTION' | 'ORDER' | null;

    handlePayment(
        content: { requestPaymentMessage: imup.PaymentMessage },
        quoted?: proto.IWebMessageInfo
    ): Promise<{ requestPaymentMessage: proto.Message.RequestPaymentMessage }>;

    handleProduct(
        content: { productMessage: imup.ProductMessage },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<{ viewOnceMessage: proto.Message.ViewOnceMessage }>;

    handleInteractive(
        content: { interactiveMessage: imup.InteractiveMessage },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<{ interactiveMessage: proto.Message.InteractiveMessage }>;

    handleAlbum(
        content: { albumMessage: imup.AlbumItem[] },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<any>;

    handleEvent(
        content: { eventMessage: imup.EventMessage },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<any>;
    
    handlePollResult(
        content: { pollResultMessage: imup.PollResultMessage },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<any>;

    handleStMention(
        content: { statusMentionMessage: imup.StatusMentionMessage },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<any>;

    handleOrderMessage(
        content: { orderMessage: imup.OrderMessage },
        jid: string,
        quoted?: proto.IWebMessageInfo
    ): Promise<any>;
}

export = imup;
