import java.sql.*;

public class BankTransfer {

    public static void transfer(
            int fromId,
            int toId,
            double amount) throws SQLException {

        Connection con =
                DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/bank",
                        "root",
                        "password");

        try {

            con.setAutoCommit(false);

            PreparedStatement debit =
                    con.prepareStatement(
                            "UPDATE accounts " +
                            "SET balance=balance-? " +
                            "WHERE id=?");

            debit.setDouble(1, amount);
            debit.setInt(2, fromId);

            debit.executeUpdate();

            PreparedStatement credit =
                    con.prepareStatement(
                            "UPDATE accounts " +
                            "SET balance=balance+? " +
                            "WHERE id=?");

            credit.setDouble(1, amount);
            credit.setInt(2, toId);

            credit.executeUpdate();

            con.commit();

        } catch (Exception e) {

            con.rollback();

        } finally {

            con.close();
        }
    }
}