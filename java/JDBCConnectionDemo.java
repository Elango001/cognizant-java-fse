import java.sql.*;

public class JDBCConnectionDemo {

    public static void main(String[] args) {

        String url = "jdbc:mysql://localhost:3306/college";
        String user = "root";
        String password = "password";

        try {
            Connection con =
                    DriverManager.getConnection(
                            url, user, password);

            Statement stmt = con.createStatement();

            ResultSet rs =
                    stmt.executeQuery(
                            "SELECT * FROM students");

            while (rs.next()) {
                System.out.println(
                        rs.getInt("id") + " "
                                + rs.getString("name"));
            }

            con.close();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}