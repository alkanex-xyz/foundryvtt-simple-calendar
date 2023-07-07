import {ModuleName} from "../../constants";
import {CalManager, SC} from "../index";
import {Logger} from "../logging";
import {FormatDateTime} from "../utilities/date-time";

export class ChatTimestamp {
    public static addGameTimeToMessage(chatMessage: ChatMessage){
        const cal = CalManager.getActiveCalendar();
        const flagData: {id: string, timestamp: number} = {
            id: cal.id,
            timestamp: cal.toSeconds()
        };
        //Updating the message flags then updating the source with its own flags ensures what we do not wright over another modules message settings.
        //@ts-ignore
        if(!chatMessage.flags.hasOwnProperty(ModuleName)){
            //@ts-ignore
            chatMessage.flags[ModuleName] = {};
        }
        //@ts-ignore
        chatMessage.flags[ModuleName]['sc-timestamps'] = flagData;
        //@ts-ignore
        chatMessage.updateSource({ flags: chatMessage.flags, export: () => {return "no"} });
    }

    public static renderTimestamp(chatMessage: ChatMessage, html: JQuery){
        if (SC.globalConfiguration.inGameChatTimestamp) {
            const timestamps = <{id: string, timestamp: number;}>chatMessage.getFlag(ModuleName, 'sc-timestamps');
            if(timestamps){
                const cal = CalManager.getCalendar(timestamps['id']);
                if(cal){
                    const dateTime = cal.secondsToDate(timestamps['timestamp']);
                    const formattedDateTime = FormatDateTime(dateTime, `${cal.generalSettings.dateFormat.chatTime}`, cal);
                    const foundryTime = html[0].querySelector('.message-header .message-metadata .message-timestamp');
                    if(foundryTime){
                        (<HTMLElement>foundryTime).style.display = 'none';
                        const newTime = document.createElement('time');
                        newTime.classList.add('sc-timestamp');
                        newTime.innerText = formattedDateTime;
                        foundryTime.after(newTime);
                    }
                }
            }
        }
    }
}
