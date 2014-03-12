package com.fevi.app.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Created by bungubbang
 * Email: sungyong.jung@sk.com
 * Date: 3/12/14
 */
@Document
public class User {
    @Id
    private String _id;

    private String uid;
    private String favorite;

    public String get_id() {
        return _id;
    }
    public void set_id(String _id) {
        this._id = _id;
    }

    public String getUid() {
        return uid;
    }
    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getFavorite() {
        return favorite;
    }
    public void setFavorite(String favorite) {
        this.favorite = favorite;
    }

    @Override
    public String toString() {
        return "User{" +
                "_id='" + _id + '\'' +
                ", uid='" + uid + '\'' +
                ", favorite='" + favorite + '\'' +
                '}';
    }
}
