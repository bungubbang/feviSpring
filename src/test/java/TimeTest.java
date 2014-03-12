import com.fevi.app.FeviApplication;
import com.fevi.app.domain.Card;
import com.fevi.app.repository.CardRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 3/9/14
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = FeviApplication.class)
@WebAppConfiguration
public class TimeTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private CardRepository cardRepository;

    private MockMvc mvc;

    @Before
    public void setUp() {
        this.mvc = MockMvcBuilders.webAppContextSetup(this.context).alwaysDo(print()).build();
    }

    @Test
    public void timeTest() throws ParseException {
        DateFormat df1 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss+SSSS");
        String d = "2014-01-13T14:29:46+0000";
        Date parse = df1.parse(d);
        System.out.println("parse = " + parse);
    }

    @Test
    public void timeconvert() {
        String a = "yyyy-MM-ddTHH:mm:ss+SSSS";
        String s = a.split("T")[0] + " " + a.split("T")[1].split("\\+")[0];
        System.out.println("s = " + s);
    }

    @Test
    public void findByListTest() {
        ArrayList<String> cardId = new ArrayList<String>();
        cardId.add("713203582031040");
        cardId.add("713159258702139");
        List<Card> list = cardRepository.findByListId(cardId);
        for (Card card : list) {
            System.out.println("card = " + card);
        }
    }
}
