import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect  {

  @WebSocketServer() webSocketServer: Server;

  constructor( private readonly messagesWsService: MessagesWsService,
               private readonly jwtService: JwtService ) {}


  async handleConnection(client: Socket, ...args: any[]) {



    // Saludo de mano donde obtengo el token que el cliente mando desde los headers
    const accessToken = client.handshake.headers['authentication'] as string;

    let payload: JwtPayload;

    try {

      payload = this.jwtService.verify( accessToken )
                                          // payload.id -> ID del usuario de mi db
      await this.messagesWsService.registerClient(client, payload.id );

    } catch (error) {

      client.disconnect();
      return; 
    }


    console.log('Cliente conectado', payload );
    // Unir cliente a una sala
    // client.join('nombreSala')

    // Emitir todos los client conectados
    this.webSocketServer.emit('clientsConnected', this.messagesWsService.getConnectedClients() )
  }


  handleDisconnect(client: Socket ) {

    console.log('Cliente desconectado', client.id)

    this.messagesWsService.removeClient(client.id);

    // Emitir todos los client conectados
    this.webSocketServer.emit('clientsConnected', this.messagesWsService.getConnectedClients() )


  }


  // Escuchar eventos desde el client recibe el nombre del evento
  @SubscribeMessage('messageClient')
  async onMessageClient( client: Socket, payload: NewMessageDto ) {
    console.log(client.id)
    console.log(payload)

    //! Solo emitir a quien nos mando mensaje
    // client.emit('messagesFromServer', { fullName: 'Servidor', message: 'Mensaje recibido' })


    //! Emitir a todos menos al cliente que mando mensaje
    // client.broadcast.emit('messagesFromServer', { fullName: 'Servidor', message: 'Mensaje recibido' })

    //! Emitir a TODOS
    this.webSocketServer.emit('messagesFromServer', { fullName: this.messagesWsService.getUserFullName( client.id ), message: payload.message })

    //! Emitir a una sala
    // this.webSocketServer.to('nombreSala').emit('messagesFromServer', { fullName: 'Servidor', message: 'Hay un nuevo mensaje' })
  }




}
