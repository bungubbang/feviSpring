import org.junit.Test;

import java.text.SimpleDateFormat;
import java.util.Calendar;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 4/12/14
 */
public class TempTest {

    @Test
    public void time() {
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        System.out.println(formatter.format(cal.getTime()));
    }

}
