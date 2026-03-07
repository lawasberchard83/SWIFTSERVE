import java.sql.*;
import java.util.Properties;

public class TestConnection {
    public static void main(String[] args) {
        // Try multiple connection approaches
        String[][] attempts = {
            // Approach 1: Session pooler port 5432 with sslmode
            {"jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require", "postgres.vboovedckhmcddoseufl"},
            // Approach 2: Transaction pooler port 6543
            {"jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require", "postgres.vboovedckhmcddoseufl"},
            // Approach 3: Session pooler with options parameter
            {"jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require&options=reference%3Dvboovedckhmcddoseufl", "postgres"},
            // Approach 4: port 5432 without ssl
            {"jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres", "postgres.vboovedckhmcddoseufl"},
        };
        
        String password = "HelloWorld1&CLASHOFCLAN1";
        
        for (int i = 0; i < attempts.length; i++) {
            String url = attempts[i][0];
            String user = attempts[i][1];
            System.out.println("\n--- Attempt " + (i+1) + " ---");
            System.out.println("URL: " + url);
            System.out.println("User: " + user);
            
            try {
                Class.forName("org.postgresql.Driver");
                Connection conn = DriverManager.getConnection(url, user, password);
                System.out.println("SUCCESS! Connected!");
                conn.close();
                return;
            } catch (Exception e) {
                System.out.println("FAILED: " + e.getMessage());
            }
        }
    }
}
