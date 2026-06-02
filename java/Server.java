import java.net.*;
import java.io.*;

public class Server {

    public static void main(String[] args)
            throws Exception {

        ServerSocket server =
                new ServerSocket(5000);

        Socket socket =
                server.accept();

        BufferedReader in =
                new BufferedReader(
                        new InputStreamReader(
                                socket.getInputStream()));

        System.out.println(
                "Client: " + in.readLine());

        socket.close();
        server.close();
    }
}