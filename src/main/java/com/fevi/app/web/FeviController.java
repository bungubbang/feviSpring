package com.fevi.app.web;

import com.fevi.app.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 3/6/14
 */
@Controller
public class FeviController {

    @Autowired CardRepository cardRepository;

    @ModelAttribute("ad")
    public Integer ad() {
        return 0;
    }

    @ModelAttribute("isFevi")
    public Integer isFevi(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        return userAgent.contains("Fevi") ? 1:0;
    }

    @RequestMapping("/")
    public RedirectView intro() {
        RedirectView rv = new RedirectView("/trend");
        rv.setExposeModelAttributes(false);
        return rv;
    }

    @RequestMapping("/intro")
    public String intro_new(){
        return "templates/layout";
    }

    @RequestMapping("/trend")
    public String trend(Model model) {
        model.addAttribute("title", "trend");
        model.addAttribute("type", "cards");
        return "cards";
    }

    @RequestMapping("/lol")
    public String lol(Model model) {
        model.addAttribute("title", "lol");
        model.addAttribute("type", "cards");
        return "cards";
    }

    @RequestMapping("/music")
    public String music(Model model) {
        model.addAttribute("title", "music");
        model.addAttribute("type", "cards");
        return "cards";
    }

    @RequestMapping("/sports")
    public String sports(Model model) {
        model.addAttribute("title", "sports");
        model.addAttribute("type", "cards");
        return "cards";
    }

    @RequestMapping("{title}/card")
    public String cardDetail(Model model, @PathVariable String title, @RequestParam String id) {
        model.addAttribute("card", cardRepository.findById(id));
        model.addAttribute("title", title);
        return "card_id";
    }

    @RequestMapping("/favorite")
    public String favorite(Model model) {
        model.addAttribute("title", "favorite");
        model.addAttribute("type", "favorite");
        return "cards";
    }

    @RequestMapping("/contact")
    public String contact(Model model) {
        model.addAttribute("title", "contact");
        return "contact";
    }

    @RequestMapping("/weekly")
    public String weekly(Model model) {
        model.addAttribute("title", "weekly");
        model.addAttribute("type", "weekly");
        return "cards";
    }

    @RequestMapping("/not_support")
    public String not_support() {
        return "not_support";
    }
}
