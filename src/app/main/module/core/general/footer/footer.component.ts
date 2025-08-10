import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommanService } from '../../sharedServices/comman.service';
import {Client as ConversationsClient} from "@twilio/conversations"
import { LandingPageService } from '../../services/landing-page.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { nanoid } from 'nanoid'
import { lastValueFrom, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit, AfterViewInit, OnDestroy {
  status: boolean = false;
  imageUrl: String;
  footerData: any;
  socialData: any;
  consversationData:any;
  client: ConversationsClient | undefined;
  isChatToken:any=false;
  chatToken:any;
  messageText:any;
  submitted:boolean = false
  messageArray:any=[];
  userRegBtn=true;
  userName:any;
  userEmail:string = '';


  constructor(
    private _commannService: CommanService,
    private cd: ChangeDetectorRef,
    private landingPageService:LandingPageService,
    @Inject(PLATFORM_ID) private platformId: Object
    ) {
    this.imageUrl = environment.imageEndPoint;
    this.consversationData = {
      statusString: "",
      activeConversation: null,
      name: "",
      nameRegistered: false,
      isConnected: false
  };
  }

  chatTokenForm = new FormGroup({
    username: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required, Validators.pattern('[A-Za-z0-9._%-+-]+@[A-Za-z0-9._%-]+\\.[A-Za-z]{2,}')])
  });

  chatMessageForm= new FormGroup({
    outgoing: new FormControl(''),
  })

  ngOnInit(): void {
    this.getfooterSection();
    if (isPlatformBrowser(this.platformId)) {
    
      this.loadSupportMessages();
     
      setTimeout(() => {
       
        
        this.status = true;
      }, 12000);
    
    }

    
  }

  parseJwt (token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async loadSupportMessages() {
  this.isChatToken = false;
    // get token stored in the local storage
    const token = localStorage.getItem('TWILIO_ACCESS_TOKEN');
    const conversationId = localStorage.getItem('TWILIO_CONVERSATION_SID')
    if (token && conversationId) {
      try {
        this.userRegBtn = false;
        // parse token and check expiration
        const tokenData = this.parseJwt(token);
        if (tokenData && tokenData.exp) {
          const hasExpiredToken = new Date().valueOf() >= new Date(tokenData.exp * 1000).valueOf();
          const userIdentity = tokenData.grants.identity;
          this.userName = userIdentity;
          if (hasExpiredToken) {
            try {
              this.chatToken = await lastValueFrom(this.generateChatToken());
              // show send message text in the button
              this.isChatToken = true;
            } catch (error) {
              this.userRegBtn = true;
              this.isChatToken = false;
            }
          } else {
            this.chatToken = token;
            // show send message text in the button
            this.isChatToken = true;
          }
          await this.initConversationsClient(this.chatToken);
          this.consversationData.activeConversation = await this.client!.getConversationBySid(conversationId);
          this.client?.on('tokenAboutToExpire', this.handleTokenExpiration);
          if (this.consversationData && this.consversationData.activeConversation) {
            this.consversationData.activeConversation.on("messageAdded", this.handleReceivedMessage.bind(this));
          }
          this.getChatMessages();
        }
      } catch (error) {
          // show loader
          this.userRegBtn = true;
      }
    }
  }


  ngAfterViewInit(): void {


  }

  clickEvent(){
    this.status = !this.status;
}


  getfooterSection() {
    this._commannService.commanfooterdata.subscribe((res: any) => {
      if (res) {
        this.footerData = res.data.attributes.footer;
        this.socialData=res.data.attributes.socialLinks;
        this.cd.detectChanges();

      }
    })
  }

  generateChatToken() {
    return this.landingPageService.chatToken(this.userName).pipe(
      tap(
        res => {
          localStorage.setItem('TWILIO_ACCESS_TOKEN', res);
        }
      )
    );
  }



// GETTING USER CHAT TOKEN

getUserChatToken() {
  this.submitted = true
  if(this.chatTokenForm.invalid){
    return
  }
  this.isChatToken = false;
   this.userRegBtn = false;
   const userName = this.chatTokenForm.value['username'];
   const userEmail = this.chatTokenForm.value['email']
  this.userName = `${userName} (${nanoid()})`;
  this.userEmail = userEmail;
  this.generateChatToken().subscribe(async (res:any)=>{
    console.log(res);

  this.chatToken = res;
  if(res!=null) {
     try {
      await this.initConversationsClient(res)

    // setTimeout(() => {
      await this.createConversation(this.userName)
    // }, 5000);

    // setTimeout(() => {
      this.addConversationMessage()
      this.getChatMessages()
    // }, 11000);

    // setTimeout(() => {
    //  this.isChatToken = true
    // }, 12000);
     } catch (error) {
      this.isChatToken = false;
      this.userRegBtn = true;
     }

  }

 })
}

handleTokenExpiration() {
  this.landingPageService.chatToken(this.userName).subscribe(
    res => {
      if (res) {
        this.chatToken = res;
        this.client?.updateToken(this.chatToken).then(result => {
          console.log('res', result);
        }).catch(
          err => {
            console.log('err', err);
          }
        );
      }
    }
  )
}

  // INITIALIZING THE CONVERSATION CLIENT

initConversationsClient(token:any) {
  return new Promise((resolve, reject) => {
    this.client = new ConversationsClient(token)
    console.log("cliet object",this.client);

    this.consversationData.statusString = "Connecting to Twilio..."
    this.client.on("connectionStateChanged", (state:any) => {
        switch (state) {
        case "connected":
          this.consversationData.statusString = "You are connected."
          this.consversationData.isConnected = true
          resolve(true);
            break
        case "disconnecting":
          this.consversationData.statusString = "Disconnecting from Twilio..."
            break
        case "disconnected":
          this.consversationData.statusString = "Disconnected."
            break
        case "denied":
          this.consversationData.statusString = "Failed to connect."
          this.consversationData.isConnected = false
          reject(false);
            break
        }
    })
  })

}

//  CREATE CONVERSATION  CLIENT :-
async createConversation(userName:any) {
  // Ensure User1 and User2 have an open client session
  // try {

  //     // await this.client!.getUser(userName)
  //    // await this.client.getUser("sushant")


  // } catch {
  //     console.error("Waiting for User1 and User2 client sessions")
  //     return false;
  // }
  const conversationUniqueId = `help-desk-chat-${nanoid()}`;
  const conversationFriendlyName = `help desk chat with ${this.userName}`;
  // Try to create a new conversation and add User1 and User2
  // If it already exists, join instead
  try {
    console.log("in try block");
      this.client?.on('tokenAboutToExpire', this.handleTokenExpiration);
      const newConversation = await this.client!.createConversation({uniqueName: conversationUniqueId, friendlyName: conversationFriendlyName})

      console.log("1.5");
      const joinedConversation = await newConversation.join().catch((err: any) => console.log(err))
      await this.client!.user.updateFriendlyName(this.userEmail+" || "+window.location.href)
      console.log("2");
      // await joinedConversation!.add(userName).catch((err: any) => console.log("error: ", err))
      await joinedConversation!.add(environment.twilioAgentIdentity).catch((err: any) => console.log("error: ", err))
   //   await joinedConversation.add("sushant").catch((err: any) => console.log("error: ", err))
      console.log("3");
     // await joinedConversation.add("User2").catch((err: any) => console.log("error: ", err))
      this.consversationData.activeConversation = joinedConversation
      localStorage.setItem('TWILIO_CONVERSATION_SID', newConversation.sid);
      console.log("4");
      console.log("active conversatiion", this.consversationData.activeConversation);
      console.log("5");

  } catch {
    console.log("in catch");
    this.consversationData.activeConversation = await (this.client!.getConversationByUniqueName(conversationUniqueId))
    console.log(this.consversationData.activeConversation);
  } finally {
    if (this.consversationData && this.consversationData.activeConversation) {
      this.consversationData.activeConversation.on("messageAdded", this.handleReceivedMessage.bind(this));
    }
  }
}

handleReceivedMessage(message: string) {
  this.messageArray = [...this.messageArray, message]
  console.log("messages event =====>.",message);
  console.log("messages array =====>.",this.messageArray);
}

addConversationMessage() {
  console.log(this.chatMessageForm.value);
  this.messageText = this.chatMessageForm.value.outgoing
  console.log("in add conversation",  this.consversationData );

  this.consversationData.activeConversation.sendMessage(this.messageText)
  .then(() => {
      this.messageText = ""
  })
}




getChatMessages() {
  this.consversationData.activeConversation.getMessages()
  .then((newMessages: { items: any; }) => {
    console.log("new messages===>",newMessages.items);
      this.messageArray = [...this.messageArray, ...newMessages.items]
      console.log("message arrrya",this.messageArray);
      this.isChatToken = true;
  }).catch(
    (err: any) => {
      this.isChatToken = false
    }
  )

}

ngOnDestroy(): void {
  if (this.consversationData && this.consversationData.activeConversation) {
    this.consversationData.activeConversation.off("messageAdded", this.handleReceivedMessage);
  }

  if (this.client) {
    this.client.off('tokenAboutToExpire', this.handleTokenExpiration)
  }
}




}
