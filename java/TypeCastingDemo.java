public class TypeCastingDemo {
    public static void main(String[] args) {

        double d = 12.75;
        int i = (int) d; // Explicit casting

        System.out.println("Double value: " + d);
        System.out.println("Converted to int: " + i);

        int num = 25;
        double d2 = num; // Implicit casting

        System.out.println("Int value: " + num);
        System.out.println("Converted to double: " + d2);
    }
}