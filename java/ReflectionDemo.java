import java.lang.reflect.*;

class Person {

    public void greet() {
        System.out.println("Hello");
    }
}

public class ReflectionDemo {

    public static void main(String[] args)
            throws Exception {

        Class<?> c =
                Class.forName("Person");

        Object obj =
                c.getDeclaredConstructor()
                        .newInstance();

        for (Method m :
                c.getDeclaredMethods()) {

            System.out.println(
                    m.getName());

            m.invoke(obj);
        }
    }
}