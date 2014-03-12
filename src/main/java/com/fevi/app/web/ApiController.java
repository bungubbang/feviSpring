package com.fevi.app.web;

import com.fevi.app.domain.Card;
import com.fevi.app.domain.User;
import com.fevi.app.repository.CardRepository;
import com.fevi.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 3/10/14
 */
@RestController
@RequestMapping("api")
public class ApiController {

    @Autowired CardRepository cardRepository;
    @Autowired UserRepository userRepository;


    private static Integer PAGE_SIZE=10;

    @RequestMapping("{menu}/today")
    public Page<Card> todayCard(@PathVariable String menu, @RequestParam(defaultValue = "0") Integer page) {
        PageRequest pageRequest = new PageRequest(page, PAGE_SIZE, new Sort(Sort.Direction.DESC, "updated_time"));

        return cardRepository.findByCategory(menu, pageRequest);
    }

    @RequestMapping("search")
    public List<Card> searchCard(@RequestParam String keyword) {
        return cardRepository.findByDescriptionContaining(keyword, new Sort(Sort.Direction.DESC, "updated_time"));

    }

    @RequestMapping("favorite")
    public List<Card> favoriteCard(@RequestParam List<String> keyword){
        return cardRepository.findByListId(keyword);
    }

    @RequestMapping(value = "user", method = RequestMethod.GET)
    public User getUser(@RequestParam String uid) {
        return userRepository.findByUid(uid);
    }

    @RequestMapping(value = "user", method = RequestMethod.POST)
    public String postUser(@RequestParam User user) {
        User byUid = userRepository.findByUid(user.getUid());
        byUid.setFavorite(user.getFavorite());
        userRepository.save(byUid);

        return "favorite";
    }


}
