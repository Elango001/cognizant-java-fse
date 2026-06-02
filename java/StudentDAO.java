import java.sql.*;

public class StudentDAO {

    private static final String URL =
            "jdbc:mysql://localhost:3306/college";

    private static final String USER = "root";
    private static final String PASSWORD = "password";

    public void insertStudent(int id, String name)
            throws SQLException {

        Connection con =
                DriverManager.getConnection(
                        URL, USER, PASSWORD);

        String sql =
                "INSERT INTO students VALUES (?, ?)";

        PreparedStatement ps =
                con.prepareStatement(sql);

        ps.setInt(1, id);
        ps.setString(2, name);

        ps.executeUpdate();

        con.close();
    }

    public void updateStudent(int id, String newName)
            throws SQLException {

        Connection con =
                DriverManager.getConnection(
                        URL, USER, PASSWORD);

        String sql =
                "UPDATE students SET name=? WHERE id=?";

        PreparedStatement ps =
                con.prepareStatement(sql);

        ps.setString(1, newName);
        ps.setInt(2, id);

        ps.executeUpdate();

        con.close();
    }
}