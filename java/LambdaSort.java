import java.util.*;

public class LambdaSort {
    public static void main(String[] args) {

        List<String> names = new ArrayList<>();

        names.add("Elango");
        names.add("Ravi");
        names.add("Akash");
        names.add("Bala");

        Collections.sort(names, (a, b) -> a.compareTo(b));

        System.out.println(names);
    }
}