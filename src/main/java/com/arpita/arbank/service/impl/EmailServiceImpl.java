package com.arpita.arbank.service.impl;

import com.arpita.arbank.dto.EmailDetails;
import com.arpita.arbank.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Override
    public void sendEmailAlert(EmailDetails emailDetails) {

        try {

            log.info("Sending email to {}", emailDetails.getRecipient());

            SimpleMailMessage mailMessage = new SimpleMailMessage();

            mailMessage.setFrom(senderEmail);
            mailMessage.setTo(emailDetails.getRecipient());
            mailMessage.setText(emailDetails.getMessageBody());
            mailMessage.setSubject(emailDetails.getSubject());

            javaMailSender.send(mailMessage);

            log.info("Email sent successfully to {}", emailDetails.getRecipient());

        } catch (MailException e) {

            log.error("Failed to send email: {}", e.getMessage());

            throw new RuntimeException("Unable to send email");
        }
    }

    @Override
    public void sendEmailWithAttachment(EmailDetails emailDetails) {

        try {

            log.info(
                    "Sending email with attachment to {}",
                    emailDetails.getRecipient()
            );

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            MimeMessageHelper mimeMessageHelper =
                    new MimeMessageHelper(mimeMessage, true);

            mimeMessageHelper.setFrom(senderEmail);
            mimeMessageHelper.setTo(emailDetails.getRecipient());
            mimeMessageHelper.setText(emailDetails.getMessageBody());
            mimeMessageHelper.setSubject(emailDetails.getSubject());

            FileSystemResource file =
                    new FileSystemResource(
                            new File(emailDetails.getAttachment())
                    );

            mimeMessageHelper.addAttachment(
                    file.getFilename(),
                    file
            );

            javaMailSender.send(mimeMessage);

            log.info(
                    "{} has been sent successfully to {}",
                    file.getFilename(),
                    emailDetails.getRecipient()
            );

        } catch (MessagingException | MailException e) {

            log.error(
                    "Failed to send email attachment: {}",
                    e.getMessage()
            );

            throw new RuntimeException(
                    "Unable to send email with attachment"
            );
        }
    }
}