import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';
import { runSample } from '../helpers/dialog.helper';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect  {

  @WebSocketServer() webSocketServer: Server;

  constructor( private readonly messagesWsService: MessagesWsService,
               private readonly jwtService: JwtService ) {}


  async handleConnection(client: Socket, ...args: any[]) {


    // Saludo de mano donde obtengo el token que el cliente mando desde los headers
    const accessToken = client.handshake.headers['authentication'] as string;

    let payload: JwtPayload;

    console.log(accessToken)

    try {

      payload = this.jwtService.verify( accessToken )
                                          // payload.id -> ID del usuario de mi db
      await this.messagesWsService.registerClient(client, payload.id );

    } catch (error) {

      client.disconnect();
      return; 
    }

    // Unir cliente a una sala
    client.join( payload.id )
    console.log('Cliente conectado', payload.id)

    // Emitir todos los client conectados
    this.webSocketServer.emit('clientsConnected', this.messagesWsService.getConnectedClients() )
  }


  handleDisconnect(client: Socket ) {

    this.messagesWsService.removeClient(client.id);

    // Emitir todos los client conectados
    this.webSocketServer.emit('clientsConnected', this.messagesWsService.getConnectedClients() )

    console.log('Cliente desconectado', client.id)

  }

  

  // Escuchar eventos desde el client recibe el nombre del evento
  @SubscribeMessage('messageClient')
  async onMessageClient( client: Socket, payload: NewMessageDto ) {
  
  
    if(payload.message.includes('requisicion')){

        if(containsNumbers(payload.message)){
          client.emit('messageResponse', { fullName: 'Marianito', type: 'text', message: 'NUMERO'});
          return;
        }

        //find all reqs with id
    
    }else if(payload.message.includes('artesano')){

      //return all craftsmen related (names)
      
    }else if(payload.message.includes('info de')){
      var nombre = payload.message.split(" ");
      //LOOK UP NAMES
      
    }else if(payload.message.includes('hoy')){
      //LOOK UP: REQUISICIONES DUE, INSTALLMENTS DUE, PEDIDO DUE TODAY
      
    }else if(payload.message.includes('')){
      
    }else if(payload.message.includes('')){
      
    }


     console.log(payload)
      if ( payload.message.trim() == '' ) {
        return;
      }


      

        //* CHATBOT
        const [ responseBot] = await Promise.all([
          // this.messagesWsService.saveMessage(payload, ''),
          runSample( payload.message )
        ])

        console.log(responseBot)

        client.emit('messageResponse', { fullName: 'Marianito', type: 'text', message: responseBot})

  

    //! Solo emitir a quien nos mando mensaje
     client.emit('messagesFromServer', { fullName: 'Servidor', message: 'Mensaje recibido' })

    //! Emitir a todos menos al cliente que mando mensaje
    // client.broadcast.emit('messagesFromServer', { fullName: 'Servidor', message: 'Mensaje recibido' })

    //! Emitir a TODOS
    // this.webSocketServer.emit('messagesFromServer', { fullName: this.messagesWsService.getUserFullName( client.id ), message: payload.message })

    //! Emitir a una sala
    // this.webSocketServer.to('nombreSala').emit('messagesFromServer', { fullName: 'Servidor', message: 'Hay un nuevo mensaje' })
    
    function containsNumbers(str) {
      return /\d/.test(str);
    }
  
  }




}
