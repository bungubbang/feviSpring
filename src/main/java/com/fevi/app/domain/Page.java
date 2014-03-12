package com.fevi.app.domain;

import org.springframework.data.annotation.Id;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 3/9/14
 */
public class Page {
    @Id
    private String id;

    private String name;
    private String category;
    private String profile_image;
}
