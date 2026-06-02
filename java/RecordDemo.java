import java.util.List;

record Person(String name, int age) {}

public class RecordDemo {

    public static void main(String[] args) {

        List<Person> people = List.of(
                new Person("Elango", 21),
                new Person("Ravi", 17),
                new Person("Akash", 25)
        );

        people.forEach(System.out::println);

        System.out.println("\nAdults:");

        people.stream()
              .filter(p -> p.age() >= 18)
              .forEach(System.out::println);
    }
}