import dotenv from 'dotenv';
import { httpServer, websocketService } from './services';

dotenv.config();

const HTTP_PORT = process.env.HTTP_PORT || 8181;
const WS_PORT = parseInt(process.env.WS_PORT || '3000');

httpServer.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

websocketService(WS_PORT);
